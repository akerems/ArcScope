import Link from "next/link";

export function Logo() {
  return (
    <Link className="group flex items-center gap-2.5 rounded-lg font-semibold tracking-tight outline-none transition hover:text-[#70ffc0] focus-visible:ring-2 focus-visible:ring-[#55f6b1]/50" href="/">
      <span className="relative grid size-8 place-items-center rounded-full border border-[#55f6b1]/40 bg-[#0d241e] transition group-hover:border-[#55f6b1]/75 group-hover:shadow-[0_0_20px_rgba(85,246,177,0.16)]">
        <span className="absolute size-2.5 rounded-full bg-[#55f6b1] shadow-[0_0_16px_#55f6b1]" />
        <span className="absolute size-5 rounded-full border border-[#55f6b1]/30" />
      </span>
      <span className="text-lg">TxLoom</span>
      <span className="hidden rounded-full border border-[#283643] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#8a9bad] sm:inline">
        Testnet
      </span>
    </Link>
  );
}
