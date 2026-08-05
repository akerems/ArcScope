import { describe, expect, it } from "vitest";
import type { ExplorerAddressData } from "@/lib/arc/explorer-client";
import { normalizeAddressAnalysis } from "@/lib/arc/normalize";

const target = "0x4e42177ab52202ced872a5ef661dfc4794bb37bf";
const peer = "0xe4955b3af30441cafe5d87cb122ef1889e191894";
const hash = `0x${"a".repeat(64)}`;

function fixture(): ExplorerAddressData {
  const targetRef = { hash: target, is_contract: false, name: null };
  const peerRef = { hash: peer, is_contract: false, name: null };
  return {
    address: {
      ...targetRef,
      coin_balance: "42000000000000000000",
      is_verified: false,
    },
    counters: {
      transactions_count: "1",
      token_transfers_count: "1",
      gas_usage_count: "0",
      validations_count: "0",
    },
    transactions: [
      {
        hash,
        from: peerRef,
        to: targetRef,
        created_contract: null,
        value: "1500000000000000000",
        timestamp: "2026-08-05T07:50:02.000Z",
        status: "ok",
        result: "success",
        method: null,
      },
    ],
    tokenTransfers: [
      {
        from: peerRef,
        to: targetRef,
        token: {
          address_hash: "0x3600000000000000000000000000000000000000",
          decimals: "6",
          name: "USDC",
          symbol: "USDC",
          type: "ERC-20",
        },
        total: { decimals: "6", value: "1500000" },
        transaction_hash: hash,
        timestamp: "2026-08-05T07:50:02.000Z",
      },
    ],
    internalTransactions: [],
    tokenBalances: [
      {
        token: {
          address_hash: "0x3600000000000000000000000000000000000000",
          decimals: "6",
          name: "USDC",
          symbol: "USDC",
          type: "ERC-20",
        },
        value: "42000000",
        token_id: null,
      },
    ],
  };
}

describe("normalizeAddressAnalysis", () => {
  it("normalizes transaction values and the canonical USDC balance", () => {
    const result = normalizeAddressAnalysis(target, fixture());
    expect(result.nativeBalance).toBe("42");
    expect(result.summary.totalReceived).toBe("1.5");
    expect(result.recentTransactions[0].formattedValue).toBe("1.5");
  });

  it("builds one deduplicated directed relationship", () => {
    const result = normalizeAddressAnalysis(target, fixture());
    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(1);
    expect(result.edges[0].direction).toBe("incoming");
    expect(result.edges[0].transactionCount).toBe(1);
  });
});
