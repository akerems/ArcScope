import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CircleDot,
  MousePointer2,
  Network,
  ShieldCheck,
} from "lucide-react";
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

const graphGuide = [
  {
    icon: CircleDot,
    title: "Nodes reveal identity",
    copy: "Color and labels distinguish wallets, contracts, bridges, and the address you are investigating.",
  },
  {
    icon: ArrowRight,
    title: "Edges show direction",
    copy: "Arrows follow the flow of value, while stronger connections surface repeated activity.",
  },
  {
    icon: MousePointer2,
    title: "Every point is explorable",
    copy: "Select a node for its activity details, then expand it to uncover the next layer of connections.",
  },
];

const graphNodes = [
  {
    label: "Wallet",
    detail: "0x72…91C",
    position: "left-[9%] top-[18%]",
    tone: "border-[#59a9ff]/50 bg-[#10243a] text-[#8cc8ff]",
    dot: "bg-[#59a9ff]",
  },
  {
    label: "Contract",
    detail: "Router",
    position: "right-[8%] top-[15%]",
    tone: "border-[#b18cff]/50 bg-[#251c36] text-[#cbb1ff]",
    dot: "bg-[#b18cff]",
  },
  {
    label: "Bridge",
    detail: "Gateway",
    position: "bottom-[13%] right-[12%]",
    tone: "border-[#ffbd70]/50 bg-[#332517] text-[#ffd09a]",
    dot: "bg-[#ffbd70]",
  },
  {
    label: "Wallet",
    detail: "0xA4…2F8",
    position: "bottom-[15%] left-[8%]",
    tone: "border-[#59a9ff]/50 bg-[#10243a] text-[#8cc8ff]",
    dot: "bg-[#59a9ff]",
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
              className="panel hover-lift group rounded-xl p-5"
              href={`/address/${item.address}`}
              key={item.address}
            >
              <div className="mb-8 flex items-start justify-between">
                <span className={`size-2.5 rounded-full ${index === 0 ? "bg-[#55f6b1] shadow-[0_0_12px_#55f6b1]" : "bg-[#4982ae]"}`} />
                <span className="grid size-8 place-items-center rounded-full border border-transparent transition group-hover:border-[#55f6b1]/25 group-hover:bg-[#55f6b1]/8">
                  <ArrowUpRight className="text-[#536778] transition group-hover:text-[#72ffc0]" size={17} />
                </span>
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
              <div className="group border-b border-[#1a2833] py-8 transition-colors hover:bg-[#0d151d] md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0" key={title}>
                <div className="mb-12 flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-lg border border-[#55f6b1]/10 bg-[#55f6b1]/5 transition group-hover:border-[#55f6b1]/30 group-hover:bg-[#55f6b1]/10">
                    <Icon className="text-[#55f6b1]" size={20} />
                  </span>
                  <span className="font-mono text-xs text-[#506273]">{number}</span>
                </div>
                <h3 className="mb-3 text-lg font-semibold">{title}</h3>
                <p className="text-sm leading-6 text-[#8293a3]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[#16222d]" id="graph-guide">
        <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-72 max-w-4xl bg-[#59a9ff]/5 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <p className="eyebrow mb-3">Inside the graph</p>
            <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Read the network in seconds.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#8293a3]">
              TxLoom turns an address history into a visual trail. See who interacted,
              which way value moved, and where the strongest relationships live.
            </p>
            <div className="mt-9 space-y-3">
              {graphGuide.map(({ icon: Icon, title, copy }) => (
                <article className="guide-card group flex gap-4 rounded-xl p-4" key={title}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#273946] bg-[#0c151e] text-[#70baff] transition group-hover:border-[#59a9ff]/45 group-hover:text-[#9dd1ff]">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#e7edf2]">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#788b9b]">{copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="panel relative min-h-[420px] overflow-hidden rounded-2xl p-5 sm:min-h-[470px]">
            <div className="dot-grid absolute inset-0 opacity-55" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="eyebrow">Connection map</p>
                <p className="mt-1 text-xs text-[#607484]">A simplified visual guide</p>
              </div>
              <span className="rounded-full border border-[#294035] bg-[#55f6b1]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#55f6b1]">
                Live structure
              </span>
            </div>

            <svg
              aria-hidden="true"
              className="absolute inset-x-[6%] top-[18%] h-[68%] w-[88%]"
              preserveAspectRatio="none"
              viewBox="0 0 600 320"
            >
              <defs>
                <marker id="graph-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#4f8294" />
                </marker>
              </defs>
              <path d="M130 65 C220 70 245 120 300 160" fill="none" markerEnd="url(#graph-arrow)" stroke="#46768b" strokeWidth="2" />
              <path d="M300 160 C375 125 405 68 490 62" fill="none" markerEnd="url(#graph-arrow)" stroke="#725f91" strokeWidth="2" />
              <path d="M300 160 C390 180 420 242 485 265" fill="none" markerEnd="url(#graph-arrow)" stroke="#8b704b" strokeWidth="3" />
              <path d="M120 260 C205 242 240 190 300 160" fill="none" markerEnd="url(#graph-arrow)" stroke="#46768b" strokeDasharray="6 6" strokeWidth="2" />
              <path d="M130 65 C315 18 430 112 485 265" fill="none" markerEnd="url(#graph-arrow)" opacity=".45" stroke="#46768b" strokeWidth="1.5" />
            </svg>

            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="graph-node mx-auto grid size-20 place-items-center rounded-full border border-[#55f6b1]/55 bg-[#10271f] shadow-[0_0_32px_rgba(85,246,177,0.14)]">
                <span className="size-4 rounded-full bg-[#55f6b1] shadow-[0_0_18px_#55f6b1]" />
              </div>
              <p className="mt-3 text-xs font-semibold text-[#dce9e3]">Target address</p>
              <p className="mt-1 font-mono text-[10px] text-[#668173]">0x3F…8A2</p>
            </div>

            {graphNodes.map((node) => (
              <div className={`graph-node absolute z-10 ${node.position}`} key={`${node.label}-${node.detail}`}>
                <div className={`flex items-center gap-2 rounded-full border px-3 py-2 shadow-lg ${node.tone}`}>
                  <span className={`size-2 rounded-full ${node.dot}`} />
                  <span className="text-[11px] font-semibold">{node.label}</span>
                </div>
                <p className="mt-1 text-center font-mono text-[9px] text-[#5f7485]">{node.detail}</p>
              </div>
            ))}

            <div className="absolute bottom-4 left-5 z-10 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-[#6c7f8f]">
              <span><i className="mr-1.5 inline-block size-1.5 rounded-full bg-[#55f6b1]" />Target</span>
              <span><i className="mr-1.5 inline-block size-1.5 rounded-full bg-[#59a9ff]" />Wallet</span>
              <span><i className="mr-1.5 inline-block size-1.5 rounded-full bg-[#b18cff]" />Contract</span>
              <span><i className="mr-1.5 inline-block size-1.5 rounded-full bg-[#ffbd70]" />Bridge</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-8 text-xs text-[#5e7181] sm:flex-row sm:justify-between lg:px-8">
        <span>
          @2026 TxLoom built on Arc <span aria-hidden="true">|</span>{" "}
          <a
            className="font-semibold text-[#8296a6] underline decoration-[#334956] underline-offset-4 hover:text-[#55f6b1]"
            href="https://github.com/akerems"
            rel="noreferrer"
            target="_blank"
          >
            akerems
          </a>
        </span>
        <span>Built for exploration. Data may be delayed.</span>
      </footer>
    </main>
  );
}
