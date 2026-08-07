export type GraphNodeType =
  | "target"
  | "wallet"
  | "contract"
  | "token"
  | "bridge"
  | "unknown";

export type GraphNode = {
  id: string;
  address: string;
  label: string;
  type: GraphNodeType;
  transactionCount: number;
  totalVolume: string;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  direction: "incoming" | "outgoing";
  transactionCount: number;
  totalVolume: string;
};
