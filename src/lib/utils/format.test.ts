import { describe, expect, it } from "vitest";
import {
  formatCompactAmount,
  formatTokenAmount,
} from "@/lib/utils/format";

describe("formatTokenAmount", () => {
  it("formats raw USDC without number precision loss", () => {
    expect(formatTokenAmount("123456789012345678", 6)).toBe(
      "123456789012.345678",
    );
  });

  it("compacts huge values without converting them to number", () => {
    expect(formatCompactAmount("167437467475.879294211396879662")).toBe(
      "167.43B",
    );
  });
});
