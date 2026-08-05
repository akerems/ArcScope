import Link from "next/link";

export function Logo() {
  return (
    <Link className="flex items-center gap-2.5 font-semibold tracking-tight" href="/">
      <span className="relative grid size-8 place-items-center rounded-full border border-[#55f6b1]/40 bg-[#0d241e]">
        <span className="absolute size-2.5 rounded-full bg-[#55f6b1] shadow-[0_0_16px_#55f6b1]" />
        <span className="absolute size-5 rounded-full border border-[#55f6b1]/30" />
      </span>
      <span className="text-lg">ArcScope</span>
      <span className="hidden rounded-full border border-[#283643] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#8a9bad] sm:inline">
        Testnet
      </span>
    </Link>
  );
}
