import { getAddress } from "viem";
import type { AddressAnalysis } from "@/types/arc";
import { createMockAnalysis } from "@/lib/arc/mock-data";
import { getExplorerAddressData } from "@/lib/arc/explorer-client";
import { normalizeAddressAnalysis } from "@/lib/arc/normalize";
import { getRpcUsdcBalance } from "@/lib/arc/rpc-client";

type AnalyzeAddressOptions = {
  limit: number;
  refresh?: boolean;
};

export async function analyzeAddress(
  rawAddress: string,
  options: AnalyzeAddressOptions,
): Promise<AddressAnalysis> {
  const address = getAddress(rawAddress);
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
    return createMockAnalysis(address);
  }
  const [explorerData, rpcUsdcBalance] = await Promise.all([
    getExplorerAddressData(address, options.limit, options.refresh),
    getRpcUsdcBalance(address).catch(() => null),
  ]);
  return normalizeAddressAnalysis(address, explorerData, rpcUsdcBalance);
}
