import type { AddressAnalysis } from "@/types/arc";
import type { GraphEdge, GraphNode } from "@/types/graph";
import { MAX_GRAPH_NODES } from "@/lib/arc/constants";
import { compareDecimalStrings } from "@/lib/utils/decimal";

function strongerNode(current: GraphNode, incoming: GraphNode): GraphNode {
  return {
    ...current,
    label:
      current.label.startsWith("0x") && !incoming.label.startsWith("0x")
        ? incoming.label
        : current.label,
    transactionCount: Math.max(
      current.transactionCount,
      incoming.transactionCount,
    ),
    totalVolume:
      compareDecimalStrings(current.totalVolume, incoming.totalVolume) >= 0
        ? current.totalVolume
        : incoming.totalVolume,
  };
}

function strongerEdge(current: GraphEdge, incoming: GraphEdge): GraphEdge {
  return {
    ...current,
    transactionCount: Math.max(
      current.transactionCount,
      incoming.transactionCount,
    ),
    totalVolume:
      compareDecimalStrings(current.totalVolume, incoming.totalVolume) >= 0
        ? current.totalVolume
        : incoming.totalVolume,
  };
}

/** Merges one expanded analysis without duplicating nodes or relationships. */
export function mergeAddressGraphs(
  current: AddressAnalysis,
  expanded: AddressAnalysis,
): AddressAnalysis {
  const nodes = new Map(current.nodes.map((node) => [node.id.toLowerCase(), node]));
  for (const node of expanded.nodes) {
    const key = node.id.toLowerCase();
    const existing = nodes.get(key);
    if (existing) {
      nodes.set(key, strongerNode(existing, node));
    } else if (nodes.size < MAX_GRAPH_NODES) {
      nodes.set(key, node.type === "target" ? { ...node, type: "wallet" } : node);
    }
  }
  const allowedIds = new Set(nodes.keys());
  const edges = new Map(current.edges.map((edge) => [edge.id.toLowerCase(), edge]));
  for (const edge of expanded.edges) {
    if (
      !allowedIds.has(edge.source.toLowerCase()) ||
      !allowedIds.has(edge.target.toLowerCase())
    ) {
      continue;
    }
    const key = edge.id.toLowerCase();
    const existing = edges.get(key);
    edges.set(key, existing ? strongerEdge(existing, edge) : edge);
  }
  return { ...current, nodes: [...nodes.values()], edges: [...edges.values()] };
}
