import { createPublicClient, getAddress, http, parseAbi } from "viem";
import { arcTestnet as viemArcTestnet } from "viem/chains";
import { arcTestnet } from "@/lib/arc/config";

export const arcPublicClient = createPublicClient({
  chain: viemArcTestnet,
  transport: http(arcTestnet.rpcUrl, {
    timeout: 8_000,
    retryCount: 1,
  }),
});

const balanceOfAbi = parseAbi([
  "function balanceOf(address account) view returns (uint256)",
]);

/** Reads Arc's canonical six-decimal USDC view directly from RPC. */
export async function getRpcUsdcBalance(address: string): Promise<bigint> {
  return arcPublicClient.readContract({
    address: getAddress(arcTestnet.usdcAddress),
    abi: balanceOfAbi,
    functionName: "balanceOf",
    args: [getAddress(address)],
  });
}
