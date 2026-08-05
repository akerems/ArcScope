import type { AddressAnalysis, WalletProfile } from "@/types/arc";

/** Produces an explainable behavior estimate, never an identity claim. */
export function calculateWalletProfile(
  analysis: AddressAnalysis,
): WalletProfile {
  const { summary } = analysis;
  if (summary.transactionCount <= 2) {
    return {
      label: "Fresh wallet",
      confidence: "high",
      reasons: ["The address has two or fewer indexed transactions."],
    };
  }
  if (
    summary.lastActivityAt &&
    new Date(analysis.generatedAt).getTime() -
      new Date(summary.lastActivityAt).getTime() >
      180 * 24 * 60 * 60 * 1000
  ) {
    return {
      label: "Dormant",
      confidence: "high",
      reasons: ["No visible activity was found in the last 180 days."],
    };
  }
  if (analysis.nodes.some((node) => node.type === "bridge")) {
    return {
      label: "Bridge user",
      confidence: "medium",
      reasons: ["The address has interacted with a labeled bridge contract."],
    };
  }
  const contractRatio =
    summary.uniqueConnections === 0
      ? 0
      : summary.contractsInteracted / summary.uniqueConnections;

  if (contractRatio >= 0.5) {
    return {
      label: "Contract-heavy",
      confidence: "medium",
      reasons: [
        `${summary.contractsInteracted} of ${summary.uniqueConnections} connections are contracts.`,
        "Activity spans multiple on-chain applications.",
      ],
    };
  }
  if (
    summary.outgoingTransactionCount >
    summary.incomingTransactionCount * 2
  ) {
    return {
      label: "Distributor",
      confidence: "medium",
      reasons: ["Outgoing activity is more than twice incoming activity."],
    };
  }
  if (
    summary.incomingTransactionCount >
    summary.outgoingTransactionCount * 2
  ) {
    return {
      label: "Collector",
      confidence: "medium",
      reasons: ["Incoming activity is more than twice outgoing activity."],
    };
  }
  if (summary.uniqueConnections >= 10) {
    return {
      label: "Explorer",
      confidence: "medium",
      reasons: ["The address interacts with at least ten unique counterparties."],
    };
  }

  return {
    label: "Balanced activity",
    confidence: "medium",
    reasons: [
      "Incoming and outgoing activity are relatively balanced.",
      "The wallet interacts with several unique counterparties.",
    ],
  };
}
