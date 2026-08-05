import { ArrowDownLeft, ArrowUpRight, ExternalLink, Plus } from "lucide-react";
import { arcTestnet } from "@/lib/arc/config";
import { formatCompactAmount } from "@/lib/utils/format";
import { shortenAddress } from "@/lib/utils/address";
import type { GraphEdge, GraphNode } from "@/types/graph";

type NodeDetailsPanelProps = {
  node: GraphNode;
  edges: GraphEdge[];
  canExpand: boolean;
  isExpanding: boolean;
  onExpand: () => void;
};

export function NodeDetailsPanel({
  node,
  edges,
  canExpand,
  isExpanding,
  onExpand,
}: NodeDetailsPanelProps) {
  const incoming = edges.filter((edge) => edge.target === node.id).length;
  const outgoing = edges.filter((edge) => edge.source === node.id).length;

  return (
    <aside className="panel flex min-h-[520px] flex-col rounded-xl p-5">
      <div className="mb-8 flex items-center justify-between">
        <p className="eyebrow">Node details</p>
        <span className="rounded-md border border-[#293a47] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#88a0b2]">
          {node.type}
        </span>
      </div>
      <div className="mb-8">
        <div className="mb-4 grid size-11 place-items-center rounded-full border border-[#55f6b1]/40 bg-[#55f6b1]/8">
          <span className="size-2.5 rounded-full bg-[#55f6b1] shadow-[0_0_12px_#55f6b1]" />
        </div>
        <h2 className="font-mono text-lg font-semibold">{shortenAddress(node.address, 7)}</h2>
        <p className="mt-2 break-all font-mono text-[11px] leading-5 text-[#667989]">{node.address}</p>
      </div>
      <dl className="divide-y divide-[#1b2934] border-y border-[#1b2934]">
        <div className="flex items-center justify-between py-4">
          <dt className="text-xs text-[#718494]">Transactions</dt>
          <dd className="text-sm font-semibold">{node.transactionCount}</dd>
        </div>
        <div className="flex items-center justify-between py-4">
          <dt className="text-xs text-[#718494]">Transferred volume</dt>
          <dd className="text-sm font-semibold">{formatCompactAmount(node.totalVolume)} USDC</dd>
        </div>
        <div className="flex items-center justify-between py-4">
          <dt className="flex items-center gap-2 text-xs text-[#718494]"><ArrowDownLeft size={13} /> Incoming</dt>
          <dd className="text-sm font-semibold">{incoming}</dd>
        </div>
        <div className="flex items-center justify-between py-4">
          <dt className="flex items-center gap-2 text-xs text-[#718494]"><ArrowUpRight size={13} /> Outgoing</dt>
          <dd className="text-sm font-semibold">{outgoing}</dd>
        </div>
      </dl>
      <div className="mt-auto space-y-2 pt-8">
        <button
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#55f6b1] text-sm font-semibold text-[#06110c] transition enabled:hover:bg-[#77ffc4] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!canExpand || isExpanding}
          onClick={onExpand}
          title={canExpand ? "Load this address's connections" : "Two-hop limit reached or already expanded"}
          type="button"
        >
          <Plus className={isExpanding ? "animate-spin" : ""} size={15} />
          {isExpanding ? "Expanding…" : "Expand node"}
        </button>
        {node.address ? (
          <a
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#293946] text-xs text-[#8ba0af] transition hover:text-white"
            href={`${arcTestnet.explorerUrl}/address/${node.address}`}
            rel="noreferrer"
            target="_blank"
          >
            Open in explorer <ExternalLink size={13} />
          </a>
        ) : null}
      </div>
    </aside>
  );
}
