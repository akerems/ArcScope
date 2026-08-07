import { describe, expect, it } from "vitest";
import { createMockAnalysis } from "@/lib/arc/mock-data";
import { calculateWalletProfile } from "@/lib/arc/wallet-profile";

describe("calculateWalletProfile", () => {
  it("returns an explainable bridge estimate", () => {
    const analysis = createMockAnalysis(
      "0x4e42177ab52202ced872a5ef661dfc4794bb37bf",
    );
    const profile = calculateWalletProfile(analysis);
    expect(profile.label).toBe("Bridge user");
    expect(profile.reasons.length).toBeGreaterThan(0);
  });

  it("labels a nearly unused address as fresh", () => {
    const analysis = createMockAnalysis(
      "0x4e42177ab52202ced872a5ef661dfc4794bb37bf",
    );
    analysis.summary.transactionCount = 1;
    expect(calculateWalletProfile(analysis).label).toBe("Fresh wallet");
  });
});
