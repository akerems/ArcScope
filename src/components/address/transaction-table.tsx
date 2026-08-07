import { ArrowDownLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import type { AddressAnalysis } from "@/types/arc";
import { arcTestnet } from "@/lib/arc/config";
import { shortenAddress } from "@/lib/utils/address";
import { formatCompactAmount, formatDate } from "@/lib/utils/format";

export function TransactionTable({ analysis }: { analysis: AddressAnalysis }) {
  return (
    <section className="panel overflow-hidden rounded-xl">
      <div className="flex items-center justify-between border-b border-[#1c2a35] px-5 py-4">
        <div>
          <p className="eyebrow">Activity</p>
          <h2 className="mt-1 text-lg font-semibold">Recent transactions</h2>
        </div>
        <span className="text-xs text-[#687b8a]">Latest 10</span>
      </div>
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="text-[10px] uppercase tracking-wider text-[#657989]">
            <tr>
              <th className="px-5 py-3 font-semibold">Transaction</th>
              <th className="px-5 py-3 font-semibold">Direction</th>
              <th className="px-5 py-3 font-semibold">Counterparty</th>
              <th className="px-5 py-3 font-semibold">Value</th>
              <th className="px-5 py-3 font-semibold">Time</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#182631] text-sm">
            {analysis.recentTransactions.slice(0, 10).map((tx) => {
              const incoming = tx.to?.toLowerCase() === analysis.address.toLowerCase();
              const counterparty = incoming ? tx.from : tx.to;
              return (
                <tr className="transition hover:bg-[#101820]" key={tx.hash}>
                  <td className="px-5 py-4 font-mono text-xs text-[#aab8c3]">{shortenAddress(tx.hash, 6)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs ${incoming ? "text-[#55f6b1]" : "text-[#71b6f2]"}`}>
                      {incoming ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                      {incoming ? "Incoming" : "Outgoing"}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-[#8395a4]">{counterparty ? shortenAddress(counterparty, 6) : "Contract creation"}</td>
                  <td className="px-5 py-4 font-medium">{formatCompactAmount(tx.formattedValue)} <span className="text-[10px] text-[#607484]">USDC</span></td>
                  <td className="px-5 py-4 text-xs text-[#6c7f8f]">{formatDate(tx.timestamp)}</td>
                  <td className="px-5 py-4">
                    <a aria-label="Open transaction in explorer" className="text-[#617687] transition hover:text-white" href={`${arcTestnet.explorerUrl}/tx/${tx.hash}`} rel="noreferrer" target="_blank">
                      <ExternalLink size={14} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
