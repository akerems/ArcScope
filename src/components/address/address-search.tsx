"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { addressSchema } from "@/lib/validations/address";
import { MOCK_TARGET_ADDRESS } from "@/lib/arc/constants";

type AddressSearchProps = {
  compact?: boolean;
};

export function AddressSearch({ compact = false }: AddressSearchProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function submit(address: string) {
    const result = addressSchema.safeParse(address);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Enter a valid EVM address.");
      return;
    }
    setError("");
    router.push(`/address/${result.data}`);
  }

  return (
    <div className={compact ? "w-full" : "mx-auto w-full max-w-3xl"}>
      <form
        className="relative"
        onSubmit={(event) => {
          event.preventDefault();
          submit(value);
        }}
      >
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-[#607587]"
          size={compact ? 18 : 21}
        />
        <input
          aria-invalid={Boolean(error)}
          aria-label="Wallet or contract address"
          className={`w-full rounded-xl border bg-[#0a1119] pl-13 pr-34 text-white outline-none transition placeholder:text-[#526272] focus:border-[#55f6b1]/60 focus:ring-4 focus:ring-[#55f6b1]/8 ${
            compact ? "h-12 text-sm" : "h-16 text-base"
          } ${error ? "border-red-400/70" : "border-[#243442]"}`}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError("");
          }}
          placeholder="Paste a wallet or contract address"
          spellCheck={false}
          value={value}
        />
        <button
          className={`group absolute right-2 top-1/2 flex -translate-y-1/2 cursor-pointer items-center gap-2 rounded-lg bg-[#55f6b1] px-4 font-semibold text-[#04100b] shadow-[0_0_0_rgba(85,246,177,0)] transition hover:-translate-y-[54%] hover:bg-[#79ffc5] hover:shadow-[0_8px_22px_rgba(85,246,177,0.16)] ${
            compact ? "h-9 text-sm" : "h-12"
          }`}
          type="submit"
        >
          Analyze <ArrowRight className="transition-transform group-hover:translate-x-0.5" size={16} />
        </button>
      </form>
      {error ? (
        <p className="mt-2 text-left text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      {!compact ? (
        <button
          className="mt-4 text-sm text-[#8a9bad] transition hover:text-[#55f6b1]"
          onClick={() => submit(MOCK_TARGET_ADDRESS)}
          type="button"
        >
          No address handy? <span className="underline underline-offset-4">Try an example</span>
        </button>
      ) : null}
    </div>
  );
}
