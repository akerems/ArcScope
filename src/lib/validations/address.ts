import { isAddress } from "viem";
import { z } from "zod";

export const addressSchema = z
  .string()
  .trim()
  .min(1, "Enter a wallet or contract address.")
  .refine(isAddress, "Enter a valid EVM address.");
