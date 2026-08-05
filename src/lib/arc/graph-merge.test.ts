import { describe, expect, it } from "vitest";
import { mergeAddressGraphs } from "@/lib/arc/graph-merge";
import { createMockAnalysis } from "@/lib/arc/mock-data";

describe("mergeAddressGraphs", () => {
  it("does not duplicate nodes or edges", () => {
    const analysis = createMockAnalysis(
      "0x4e42177ab52202ced872a5ef661dfc4794bb37bf",
    );
    const merged = mergeAddressGraphs(analysis, analysis);
    expect(merged.nodes).toHaveLength(analysis.nodes.length);
    expect(merged.edges).toHaveLength(analysis.edges.length);
  });
});
