import { Activity, ArrowDownLeft, ArrowUpRight, Boxes, CircleDollarSign, Network } from "lucide-react";
import type { AddressAnalysis } from "@/types/arc";
import { formatCompactAmount } from "@/lib/utils/format";

type AddressStatsProps = {
  analysis: AddressAnalysis;
};

export function AddressStats({ analysis }: AddressStatsProps) {
  const { summary } = analysis;
  const stats = [
    { label: "Native balance", value: formatCompactAmount(analysis.nativeBalance), suffix: "USDC", icon: CircleDollarSign },
    { label: "Total received", value: formatCompactAmount(summary.totalReceived), suffix: "USDC", icon: ArrowDownLeft },
    { label: "Total sent", value: formatCompactAmount(summary.totalSent), suffix: "USDC", icon: ArrowUpRight },
    { label: "Transactions", value: summary.transactionCount.toLocaleString(), icon: Activity },
    { label: "Connections", value: summary.uniqueConnections.toLocaleString(), icon: Network },
    { label: "Contracts used", value: summary.contractsInteracted.toLocaleString(), icon: Boxes },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#1d2a36] bg-[#1d2a36] lg:grid-cols-6">
      {stats.map(({ label, value, suffix, icon: Icon }) => (
        <div className="bg-[#0a1017] p-4 sm:p-5" key={label}>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-xs text-[#758797]">{label}</p>
            <Icon className="text-[#53697a]" size={15} />
          </div>
          <p className="text-xl font-semibold tracking-tight">
            {value}{" "}
            {suffix ? <span className="text-[10px] font-bold tracking-wider text-[#637687]">{suffix}</span> : null}
          </p>
        </div>
      ))}
    </div>
  );
}
