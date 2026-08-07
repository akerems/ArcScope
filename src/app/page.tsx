import { ArrowUpRight, Boxes, Network, ShieldCheck } from "lucide-react";
import { AddressSearch } from "@/components/address/address-search";
import { shortenAddress } from "@/lib/utils/address";
import { MOCK_TARGET_ADDRESS } from "@/lib/arc/constants";

const recent = [
  { address: MOCK_TARGET_ADDRESS, type: "Wallet", txs: "84 txs", ago: "2m ago" },
  { address: "0x2f318C334780961FB129D2a6c30D0763d9a5C970", type: "Bridge", txs: "312 txs", ago: "8m ago" },
  { address: "0xB175474E89094C44Da98B954EedeAC495271d0F", type: "Contract", txs: "1.2k txs", ago: "17m ago" },
];

const features = [
  {
    icon: Network,
    number: "01",
    title: "Trace connections",
    copy: "Turn raw transactions into an interactive map of wallets, contracts, and value flows.",
  },
  {
    icon: Boxes,
    number: "02",
    title: "Read the activity",
    copy: "Understand balances, transfer direction, counterparties, and contract interactions at a glance.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Explore with context",
    copy: "Use transparent behavior estimates to spot patterns without making identity claims.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="relative isolate overflow-hidden border-b border-[#16222d]">
        <div className="dot-grid absolute inset-0 -z-10" />
        <div className="absolute left-1/2 top-16 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-[#31cca0]/10 blur-3xl" />
        <div className="mx-auto max-w-5xl px-5 pb-24 pt-24 text-center sm:pt-32">
          <div className="eyebrow mb-6 inline-flex items-center gap-2 rounded-full border border-[#55f6b1]/20 bg-[#55f6b1]/5 px-3 py-1.5">
            <span className="size-1.5 rounded-full bg-[#55f6b1] shadow-[0_0_8px_#55f6b1]" />
            On-chain intelligence for Arc
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-7xl">
            See how value moves{" "}
            <span className="bg-gradient-to-r from-[#55f6b1] to-[#68b8ff] bg-clip-text text-transparent">
              through Arc.
            </span>
          </h1>
          <p className="mx-auto mb-10 mt-6 max-w-2xl text-lg leading-8 text-[#94a4b4]">
            Explore any wallet or contract through a clear, interactive map.
            Follow connections, surface patterns, and make sense of on-chain activity.
          </p>
          <AddressSearch />
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#667889]">
            <span>Live network graph</span>
            <span className="hidden size-1 rounded-full bg-[#314454] sm:block" />
            <span>Read-only analysis</span>
            <span className="hidden size-1 rounded-full bg-[#314454] sm:block" />
            <span>No wallet connection</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-3">Network pulse</p>
            <h2 className="text-2xl font-semibold tracking-tight">Recently analyzed</h2>
          </div>
          <span className="hidden text-sm text-[#6f8192] sm:block">Demo activity</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {recent.map((item, index) => (
            <a
              className="panel group rounded-xl p-5 transition hover:-translate-y-0.5 hover:border-[#355063]"
              href={`/address/${item.address}`}
              key={item.address}
            >
              <div className="mb-8 flex items-start justify-between">
                <span className={`size-2.5 rounded-full ${index === 0 ? "bg-[#55f6b1] shadow-[0_0_12px_#55f6b1]" : "bg-[#4982ae]"}`} />
                <ArrowUpRight className="text-[#536778] transition group-hover:text-white" size={17} />
              </div>
              <p className="font-mono text-sm text-[#dce5eb]">{shortenAddress(item.address, 7)}</p>
              <div className="mt-3 flex gap-2 text-xs text-[#758797]">
                <span>{item.type}</span><span>·</span><span>{item.txs}</span><span>·</span><span>{item.ago}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="border-y border-[#16222d] bg-[#080d13]" id="how-it-works">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="max-w-xl">
            <p className="eyebrow mb-3">From data to signal</p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              A clearer lens on every address.
            </h2>
          </div>
          <div className="mt-12 grid border-t border-[#1a2833] md:grid-cols-3">
            {features.map(({ icon: Icon, number, title, copy }) => (
              <div className="border-b border-[#1a2833] py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0" key={title}>
                <div className="mb-12 flex items-center justify-between">
                  <Icon className="text-[#55f6b1]" size={23} />
                  <span className="font-mono text-xs text-[#506273]">{number}</span>
                </div>
                <h3 className="mb-3 text-lg font-semibold">{title}</h3>
                <p className="text-sm leading-6 text-[#8293a3]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-8 text-xs text-[#5e7181] sm:flex-row sm:justify-between lg:px-8">
        <span>© 2026 TxLoom</span>
        <span>Built for exploration. Data may be delayed.</span>
      </footer>
    </main>
  );
}
