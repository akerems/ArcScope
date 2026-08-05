import { describe, expect, it } from "vitest";
import { addressSchema } from "@/lib/validations/address";

describe("addressSchema", () => {
  it("accepts a valid EVM address", () => {
    expect(
      addressSchema.safeParse(
        "0x4e42177ab52202ced872a5ef661dfc4794bb37bf",
      ).success,
    ).toBe(true);
  });

  it("rejects empty and malformed values", () => {
    expect(addressSchema.safeParse("").success).toBe(false);
    expect(addressSchema.safeParse("0x1234").success).toBe(false);
  });
});
