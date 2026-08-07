import Link from "next/link";
import { Github } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export function Navbar() {
  return (
    <header className="relative z-20 border-b border-[#16222d] bg-[#060a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Logo />
        <nav className="flex items-center gap-1 text-sm text-[#8a9bad] sm:gap-2">
          <Link className="hidden rounded-lg px-3 py-2 transition hover:bg-white/5 hover:text-white sm:block" href="/#how-it-works">
            How it works
          </Link>
          <Link className="hidden rounded-lg px-3 py-2 transition hover:bg-white/5 hover:text-white md:block" href="/#graph-guide">
            Graph guide
          </Link>
          <a
            aria-label="View TxLoom on GitHub"
            className="grid size-9 place-items-center rounded-lg border border-transparent transition hover:border-[#2b3d4a] hover:bg-white/5 hover:text-white"
            href="https://github.com/akerems/TxLoom"
            rel="noreferrer"
            target="_blank"
          >
            <Github size={18} />
          </a>
        </nav>
      </div>
    </header>
  );
}
