import Link from "next/link";
import { Github } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export function Navbar() {
  return (
    <header className="relative z-20 border-b border-[#16222d] bg-[#060a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Logo />
        <nav className="flex items-center gap-5 text-sm text-[#8a9bad]">
          <Link className="hidden transition hover:text-white sm:block" href="/#how-it-works">
            How it works
          </Link>
          <a
            aria-label="View ArcScope on GitHub"
            className="transition hover:text-white"
            href="https://github.com/akerems/ArcScope"
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
