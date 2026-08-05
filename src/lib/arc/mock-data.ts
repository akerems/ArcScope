import { getAddress } from "viem";
import type { AddressAnalysis } from "@/types/arc";

const peers = [
  ["0x2f318C334780961FB129D2a6c30D0763d9a5C970", "Circle Bridge", "bridge"],
  ["0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", "USDC Contract", "token"],
  ["0xB175474E89094C44Da98B954EedeAC495271d0F", "Swap Router", "contract"],
  ["0x9F4e2C4f61311F4d03aF8eC0C92219Bca1C9F427", "0x9F4e…F427", "wallet"],
  ["0x4d224452801ACEd8B2F0aebE155379bb5D594381", "0x4d22…4381", "wallet"],
  ["0x6B175474E89094C44Da98b954EedeAC495271d0F", "Liquidity Pool", "contract"],
] as const;

/** Creates deterministic development data while preserving the requested address. */
export function createMockAnalysis(rawAddress: string): AddressAnalysis {
  const address = getAddress(rawAddress);
  const metrics = [31, 24, 17, 7, 4, 3];
  const volumes = ["214500", "146250", "82300", "51680", "19820", "10310"];
  const nodes: AddressAnalysis["nodes"] = [
    {
      id: address,
      address,
      label: "Analyzed address",
      type: "target",
      transactionCount: 84,
      totalVolume: "524860.42",
    },
    ...peers.map(([peerAddress, label, type], index) => ({
      id: peerAddress,
      address: peerAddress,
      label,
      type,
      transactionCount: metrics[index],
      totalVolume: volumes[index],
    })),
  ];
  const edges = peers.map(([peerAddress], index) => {
    const incoming = index === 0 || index === 3;
    return {
      id: `edge-${index}`,
      source: incoming ? peerAddress : address,
      target: incoming ? address : peerAddress,
      direction: incoming ? ("incoming" as const) : ("outgoing" as const),
      transactionCount: metrics[index],
      totalVolume: volumes[index],
    };
  });

  return {
    address,
    addressType: "wallet",
    nativeBalance: "12842.51",
    tokenBalances: [
      {
        contractAddress: peers[1][0],
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
        balance: "12842510000",
        formattedBalance: "12842.51",
      },
    ],
    summary: {
      transactionCount: 84,
      incomingTransactionCount: 38,
      outgoingTransactionCount: 46,
      uniqueConnections: 6,
      contractsInteracted: 3,
      totalReceived: "285420.18",
      totalSent: "239440.24",
      firstActivityAt: "2025-11-04T09:23:00.000Z",
      lastActivityAt: "2026-08-04T17:42:00.000Z",
    },
    nodes,
    edges,
    recentTransactions: edges.slice(0, 5).map((edge, index) => ({
      hash: `0x${(index + 31).toString(16).padStart(64, "a")}`,
      from: edge.source,
      to: edge.target,
      value: edge.totalVolume,
      formattedValue: edge.totalVolume,
      timestamp: new Date(Date.UTC(2026, 7, 4, 17) - index * 25_200_000).toISOString(),
      status: "success",
    })),
    generatedAt: new Date().toISOString(),
  };
}
