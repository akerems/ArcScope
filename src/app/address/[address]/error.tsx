"use client";

import { AlertTriangle } from "lucide-react";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-5 text-center">
      <div>
        <AlertTriangle className="mx-auto mb-5 text-amber-300" size={32} />
        <h1 className="text-2xl font-semibold">Analysis unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-[#8294a3]">
          We couldn&apos;t prepare this address right now. Please retry in a moment.
        </p>
        <button className="mt-6 rounded-lg bg-[#55f6b1] px-4 py-2.5 text-sm font-semibold text-[#06110c]" onClick={reset} type="button">
          Try again
        </button>
      </div>
    </main>
  );
}
