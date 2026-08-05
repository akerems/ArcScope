import { Dna } from "lucide-react";
import type { AddressAnalysis } from "@/types/arc";
import { calculateWalletProfile } from "@/lib/arc/wallet-profile";

export function WalletDna({ analysis }: { analysis: AddressAnalysis }) {
  const profile = calculateWalletProfile(analysis);

  return (
    <section className="panel rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#59a9ff]/10 text-[#78baff]">
          <Dna size={19} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6f8393]">Wallet DNA</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold">{profile.label}</h3>
            <span className="rounded-full border border-[#2a3b49] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#7e92a2]">
              {profile.confidence} confidence
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#7f91a0]">{profile.reasons.join(" ")}</p>
          <p className="mt-3 text-[11px] text-[#556979]">Behavior estimate based on visible activity — not an identity claim.</p>
        </div>
      </div>
    </section>
  );
}
