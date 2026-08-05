import { formatUnits, getAddress } from "viem";
import type { AddressAnalysis, NormalizedTransaction } from "@/types/arc";
import type { ExplorerAddressData } from "@/lib/arc/explorer-client";
import { ARC_USDC_ADDRESS } from "@/lib/arc/constants";
import { buildAddressGraph } from "@/lib/arc/graph-builder";

function safeDecimals(value: string | null, fallback = 18): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 255
    ? parsed
    : fallback;
}

function transactionValue(
  hash: string,
  nativeValue: string,
  data: ExplorerAddressData,
): string {
  const usdcTransfers = data.tokenTransfers.filter(
    (transfer) =>
      transfer.transaction_hash === hash &&
      transfer.token.address_hash.toLowerCase() ===
        ARC_USDC_ADDRESS.toLowerCase(),
  );
  if (usdcTransfers.length > 0) {
    const total = usdcTransfers.reduce(
      (sum, transfer) => sum + BigInt(transfer.total.value),
      0n,
    );
    return formatUnits(total, 6);
  }
  return formatUnits(BigInt(nativeValue), 18);
}

/** Converts Blockscout-specific responses into the stable TxLoom model. */
export function normalizeAddressAnalysis(
  requestedAddress: string,
  data: ExplorerAddressData,
  rpcUsdcBalance?: bigint | null,
): AddressAnalysis {
  const address = getAddress(requestedAddress);
  const addressLower = address.toLowerCase();
  const usdcBalance = data.tokenBalances.find(
    (balance) =>
      balance.token.address_hash.toLowerCase() ===
      ARC_USDC_ADDRESS.toLowerCase(),
  );
  const nativeBalance =
    rpcUsdcBalance !== null && rpcUsdcBalance !== undefined
      ? formatUnits(rpcUsdcBalance, 6)
      : usdcBalance
        ? formatUnits(BigInt(usdcBalance.value), 6)
        : formatUnits(BigInt(data.address.coin_balance ?? "0"), 18);
  const usdcTransfers = data.tokenTransfers.filter(
    (transfer) =>
      transfer.token.address_hash.toLowerCase() ===
      ARC_USDC_ADDRESS.toLowerCase(),
  );
  const incoming = usdcTransfers.filter(
    (transfer) => transfer.to.hash.toLowerCase() === addressLower,
  );
  const outgoing = usdcTransfers.filter(
    (transfer) => transfer.from.hash.toLowerCase() === addressLower,
  );
  const sumTransfers = (transfers: typeof usdcTransfers) =>
    formatUnits(
      transfers.reduce(
        (sum, transfer) => sum + BigInt(transfer.total.value),
        0n,
      ),
      6,
    );
  const graph = buildAddressGraph(address, data);
  const timestamps = [
    ...data.transactions.map((transaction) => transaction.timestamp),
    ...data.tokenTransfers.map((transfer) => transfer.timestamp),
    ...data.internalTransactions.map((transaction) => transaction.timestamp),
  ]
    .filter((timestamp): timestamp is string => Boolean(timestamp))
    .sort();
  const recentTransactions: NormalizedTransaction[] = data.transactions.map(
    (transaction) => {
      const formattedValue = transactionValue(
        transaction.hash,
        transaction.value,
        data,
      );
      return {
        hash: transaction.hash,
        from: getAddress(transaction.from.hash),
        to: transaction.to ? getAddress(transaction.to.hash) : null,
        value: transaction.value,
        formattedValue,
        timestamp: transaction.timestamp ?? new Date(0).toISOString(),
        status:
          transaction.status === "ok" || transaction.result === "success"
            ? "success"
            : transaction.status === null
              ? "pending"
              : "failed",
      };
    },
  );

  return {
    address,
    addressType: data.address.is_contract ? "contract" : "wallet",
    nativeBalance,
    tokenBalances: data.tokenBalances
      .filter(
        (balance) =>
          balance.token.type === "ERC-20" &&
          balance.token.decimals !== null,
      )
      .map((balance) => {
        const decimals = safeDecimals(balance.token.decimals);
        return {
          contractAddress: getAddress(balance.token.address_hash),
          name: balance.token.name ?? "Unknown token",
          symbol: balance.token.symbol ?? "TOKEN",
          decimals,
          balance: balance.value,
          formattedBalance: formatUnits(BigInt(balance.value), decimals),
        };
      }),
    summary: {
      transactionCount: Number.parseInt(data.counters.transactions_count, 10),
      incomingTransactionCount: data.transactions.filter(
        (transaction) => transaction.to?.hash.toLowerCase() === addressLower,
      ).length,
      outgoingTransactionCount: data.transactions.filter(
        (transaction) => transaction.from.hash.toLowerCase() === addressLower,
      ).length,
      uniqueConnections: graph.uniqueConnections,
      contractsInteracted: graph.nodes.filter(
        (node) => node.type === "contract" || node.type === "bridge",
      ).length,
      totalReceived: sumTransfers(incoming),
      totalSent: sumTransfers(outgoing),
      firstActivityAt: timestamps[0] ?? null,
      lastActivityAt: timestamps.at(-1) ?? null,
    },
    nodes: graph.nodes,
    edges: graph.edges,
    recentTransactions,
    generatedAt: new Date().toISOString(),
  };
}
