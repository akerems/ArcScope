"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, RefreshCw } from "lucide-react";
import { arcTestnet } from "@/lib/arc/config";
import { shortenAddress } from "@/lib/utils/address";

type AddressHeaderProps = {
  address: string;
  addressType: "wallet" | "contract" | "unknown";
  isRefreshing?: boolean;
  onRefresh?: () => void;
};

export function AddressHeader({
  address,
  addressType,
  isRefreshing = false,
  onRefresh,
}: AddressHeaderProps) {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex flex-col gap-5 border-b border-[#1a2833] pb-7 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-md border border-[#55f6b1]/20 bg-[#55f6b1]/8 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#55f6b1]">
            {addressType}
          </span>
          <span className="text-xs text-[#66798a]">Arc Testnet</span>
        </div>
        <h1 className="font-mono text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
          {shortenAddress(address, 9)}
        </h1>
        <p className="mt-2 max-w-full overflow-hidden text-ellipsis font-mono text-xs text-[#617486]">
          {address}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          className="flex h-10 items-center gap-2 rounded-lg border border-[#263644] bg-[#0b1219] px-3 text-sm text-[#a5b3bf] transition hover:border-[#3d5263] hover:text-white"
          onClick={copyAddress}
          type="button"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <a
          className="flex h-10 items-center gap-2 rounded-lg border border-[#263644] bg-[#0b1219] px-3 text-sm text-[#a5b3bf] transition hover:border-[#3d5263] hover:text-white"
          href={`${arcTestnet.explorerUrl}/address/${address}`}
          rel="noreferrer"
          target="_blank"
        >
          Explorer <ExternalLink size={14} />
        </a>
        <button
          disabled={isRefreshing}
          className="flex h-10 items-center gap-2 rounded-lg bg-[#55f6b1] px-3 text-sm font-semibold text-[#06110c] transition hover:bg-[#77ffc4]"
          onClick={onRefresh}
          type="button"
        >
          <RefreshCw className={isRefreshing ? "animate-spin" : ""} size={15} />
          {isRefreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>
    </div>
  );
}
