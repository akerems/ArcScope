import { formatUnits, getAddress } from "viem";
import type {
  ExplorerAddressData,
  ExplorerAddressRef,
} from "@/lib/arc/explorer-client";
import { ARC_USDC_ADDRESS, MAX_GRAPH_NODES } from "@/lib/arc/constants";
import { shortenAddress } from "@/lib/utils/address";
import {
  addDecimalStrings,
  compareDecimalStrings,
} from "@/lib/utils/decimal";
import type { GraphEdge, GraphNode, GraphNodeType } from "@/types/graph";

type ConnectionAccumulator = {
  ref: ExplorerAddressRef;
  direction: "incoming" | "outgoing";
  transactionHashes: Set<string>;
  volumeInUsdcUnits: bigint;
};

function connectionKey(
  address: string,
  direction: "incoming" | "outgoing",
): string {
  return `${address.toLowerCase()}:${direction}`;
}

function classifyAddress(ref: ExplorerAddressRef): GraphNodeType {
  const name = ref.name?.toLowerCase() ?? "";
  if (name.includes("bridge") || name.includes("cctp")) return "bridge";
  if (ref.is_contract) return "contract";
  return "wallet";
}

function addConnection(
  connections: Map<string, ConnectionAccumulator>,
  target: string,
  from: ExplorerAddressRef,
  to: ExplorerAddressRef,
  hash: string,
  volumeInUsdcUnits = 0n,
) {
  const targetLower = target.toLowerCase();
  const incoming = to.hash.toLowerCase() === targetLower;
  const outgoing = from.hash.toLowerCase() === targetLower;
  if (!incoming && !outgoing) return;
  const counterparty = incoming ? from : to;
  if (counterparty.hash.toLowerCase() === targetLower) return;
  const direction = incoming ? "incoming" : "outgoing";
  const key = connectionKey(counterparty.hash, direction);
  const current = connections.get(key) ?? {
    ref: counterparty,
    direction,
    transactionHashes: new Set<string>(),
    volumeInUsdcUnits: 0n,
  };
  current.transactionHashes.add(hash);
  current.volumeInUsdcUnits += volumeInUsdcUnits;
  connections.set(key, current);
}

/** Keeps the strongest peers and rolls excess activity into one bounded node. */
export function limitGraphConnections(
  targetAddress: string,
  nodes: GraphNode[],
  edges: GraphEdge[],
  maxNodes = MAX_GRAPH_NODES,
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  if (nodes.length <= maxNodes) return { nodes, edges };
  const target = nodes.find((node) => node.type === "target");
  const peers = nodes
    .filter((node) => node.type !== "target")
    .sort(
      (a, b) =>
        b.transactionCount - a.transactionCount ||
        compareDecimalStrings(b.totalVolume, a.totalVolume),
    );
  const kept = peers.slice(0, Math.max(1, maxNodes - 2));
  const keptIds = new Set(kept.map((node) => node.id));
  const omittedIds = new Set(
    peers.filter((node) => !keptIds.has(node.id)).map((node) => node.id),
  );
  const omittedEdges = edges.filter(
    (edge) => omittedIds.has(edge.source) || omittedIds.has(edge.target),
  );
  const otherId = `other:${targetAddress.toLowerCase()}`;
  const other: GraphNode = {
    id: otherId,
    address: "",
    label: "Other connections",
    type: "unknown",
    transactionCount: omittedEdges.reduce(
      (sum, edge) => sum + edge.transactionCount,
      0,
    ),
    totalVolume: addDecimalStrings(
      omittedEdges.map((edge) => edge.totalVolume),
    ),
  };
  const keptEdges = edges.filter(
    (edge) => !omittedIds.has(edge.source) && !omittedIds.has(edge.target),
  );
  const otherEdge: GraphEdge = {
    id: `${targetAddress.toLowerCase()}:other`,
    source: targetAddress,
    target: otherId,
    direction: "outgoing",
    transactionCount: other.transactionCount,
    totalVolume: other.totalVolume,
  };
  return {
    nodes: [...(target ? [target] : []), ...kept, other],
    edges: [...keptEdges, otherEdge],
  };
}

/** Aggregates transaction, transfer, and internal-call relationships. */
export function buildAddressGraph(
  targetAddress: string,
  data: ExplorerAddressData,
): { nodes: GraphNode[]; edges: GraphEdge[]; uniqueConnections: number } {
  const target = getAddress(targetAddress);
  const connections = new Map<string, ConnectionAccumulator>();

  for (const transaction of data.transactions) {
    if (transaction.to) {
      addConnection(
        connections,
        target,
        transaction.from,
        transaction.to,
        transaction.hash,
      );
    }
  }
  for (const transaction of data.internalTransactions) {
    if (transaction.to) {
      addConnection(
        connections,
        target,
        transaction.from,
        transaction.to,
        transaction.transaction_hash,
      );
    }
  }
  for (const transfer of data.tokenTransfers) {
    const isUsdc =
      transfer.token.address_hash.toLowerCase() ===
      ARC_USDC_ADDRESS.toLowerCase();
    addConnection(
      connections,
      target,
      transfer.from,
      transfer.to,
      transfer.transaction_hash,
      isUsdc ? BigInt(transfer.total.value) : 0n,
    );
  }

  const byAddress = new Map<
    string,
    { ref: ExplorerAddressRef; hashes: Set<string>; volume: bigint }
  >();
  const edges: GraphEdge[] = [];
  for (const connection of connections.values()) {
    const address = getAddress(connection.ref.hash);
    const lower = address.toLowerCase();
    const node = byAddress.get(lower) ?? {
      ref: connection.ref,
      hashes: new Set<string>(),
      volume: 0n,
    };
    for (const hash of connection.transactionHashes) node.hashes.add(hash);
    node.volume += connection.volumeInUsdcUnits;
    byAddress.set(lower, node);
    const source = connection.direction === "incoming" ? address : target;
    const edgeTarget = connection.direction === "incoming" ? target : address;
    edges.push({
      id: `${source.toLowerCase()}:${edgeTarget.toLowerCase()}`,
      source,
      target: edgeTarget,
      direction: connection.direction,
      transactionCount: connection.transactionHashes.size,
      totalVolume: formatUnits(connection.volumeInUsdcUnits, 6),
    });
  }

  const nodes: GraphNode[] = [
    {
      id: target,
      address: target,
      label: data.address.name ?? "Analyzed address",
      type: "target",
      transactionCount: Number.parseInt(
        data.counters.transactions_count,
        10,
      ),
      totalVolume: formatUnits(
        [...connections.values()].reduce(
          (sum, connection) => sum + connection.volumeInUsdcUnits,
          0n,
        ),
        6,
      ),
    },
    ...[...byAddress.entries()].map(([, value]) => {
      const address = getAddress(value.ref.hash);
      return {
        id: address,
        address,
        label: value.ref.name ?? shortenAddress(address),
        type: classifyAddress(value.ref),
        transactionCount: value.hashes.size,
        totalVolume: formatUnits(value.volume, 6),
      };
    }),
  ];

  const limited = limitGraphConnections(target, nodes, edges);
  return {
    ...limited,
    uniqueConnections: byAddress.size,
  };
}
