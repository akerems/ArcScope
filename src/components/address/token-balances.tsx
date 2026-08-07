import { Coins } from "lucide-react";
import type { TokenBalance } from "@/types/arc";
import { formatCompactAmount } from "@/lib/utils/format";
import { shortenAddress } from "@/lib/utils/address";

export function TokenBalances({ balances }: { balances: TokenBalance[] }) {
  const visible = balances.slice(0, 8);
  return (
    <section className="panel overflow-hidden rounded-xl">
      <div className="flex items-center justify-between border-b border-[#1c2a35] px-5 py-4">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h2 className="mt-1 text-lg font-semibold">Token balances</h2>
        </div>
        <Coins className="text-[#5c7182]" size={18} />
      </div>
      {visible.length === 0 ? (
        <p className="px-5 py-8 text-sm text-[#718493]">No ERC-20 token balances found.</p>
      ) : (
        <div className="grid gap-px bg-[#192733] sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((balance) => (
            <div className="bg-[#0a1118] p-5" key={balance.contractAddress}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{balance.symbol}</p>
                  <p className="mt-1 max-w-36 truncate text-xs text-[#687b8b]">{balance.name}</p>
                </div>
                <span className="rounded-md border border-[#273845] px-2 py-1 font-mono text-[9px] text-[#718696]">
                  {shortenAddress(balance.contractAddress, 3)}
                </span>
              </div>
              <p className="mt-6 text-xl font-semibold tracking-tight">
                {formatCompactAmount(balance.formattedBalance)}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
