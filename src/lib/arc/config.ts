export type ArcNetworkConfig = {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  explorerApiUrl: string;
  usdcAddress: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
};

export const arcTestnet: ArcNetworkConfig = {
  name: "Arc Testnet",
  chainId: 5042002,
  rpcUrl:
    process.env.NEXT_PUBLIC_ARC_RPC_URL ??
    "https://rpc.testnet.arc.network",
  explorerUrl:
    process.env.NEXT_PUBLIC_ARC_EXPLORER_URL ??
    "https://testnet.arcscan.app",
  explorerApiUrl:
    process.env.ARC_EXPLORER_API_URL ??
    "https://testnet.arcscan.app/api/v2",
  usdcAddress: "0x3600000000000000000000000000000000000000",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
};
