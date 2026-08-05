import type { GraphEdge, GraphNode } from "@/types/graph";

export type TokenBalance = {
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  formattedBalance: string;
};

export type NormalizedTransaction = {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  formattedValue: string;
  timestamp: string;
  status: "success" | "failed" | "pending";
};

export type AddressAnalysis = {
  address: string;
  addressType: "wallet" | "contract" | "unknown";
  nativeBalance: string;
  tokenBalances: TokenBalance[];
  summary: {
    transactionCount: number;
    incomingTransactionCount: number;
    outgoingTransactionCount: number;
    uniqueConnections: number;
    contractsInteracted: number;
    totalReceived: string;
    totalSent: string;
    firstActivityAt: string | null;
    lastActivityAt: string | null;
  };
  nodes: GraphNode[];
  edges: GraphEdge[];
  recentTransactions: NormalizedTransaction[];
  generatedAt: string;
};

export type WalletProfile = {
  label:
    | "Explorer"
    | "Distributor"
    | "Collector"
    | "Contract-heavy"
    | "Bridge user"
    | "Fresh wallet"
    | "Dormant"
    | "Balanced activity";
  confidence: "low" | "medium" | "high";
  reasons: string[];
};
