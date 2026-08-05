"use client";

import { useRef } from "react";
import { AlertTriangle, DatabaseZap, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AddressHeader } from "@/components/address/address-header";
import { AddressStats } from "@/components/address/address-stats";
import { AnalysisDashboard } from "@/components/address/analysis-dashboard";
import { TransactionTable } from "@/components/address/transaction-table";
import { WalletDna } from "@/components/address/wallet-dna";
import { TokenBalances } from "@/components/address/token-balances";
import {
  AddressApiError,
  fetchAddressAnalysis,
} from "@/lib/arc/api-client";
import { formatDate } from "@/lib/utils/format";

export function AddressAnalysisView({ address }: { address: string }) {
  const refreshNext = useRef(false);
  const query = useQuery({
    queryKey: ["address-analysis", address],
    queryFn: () => {
      const refresh = refreshNext.current;
      refreshNext.current = false;
      return fetchAddressAnalysis(address, { refresh });
    },
  });

  if (query.isPending) return <AnalysisSkeleton />;
  if (query.isError) {
    const error =
      query.error instanceof AddressApiError
        ? query.error
        : new AddressApiError(
            "SERVER_ERROR",
            "The analysis could not be completed.",
          );
    return (
      <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-5 text-center">
        <div>
          <AlertTriangle className="mx-auto mb-5 text-amber-300" size={32} />
          <p className="eyebrow mb-3">{error.code.replaceAll("_", " ")}</p>
          <h1 className="text-2xl font-semibold">Analysis unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-[#8294a3]">{error.message}</p>
          <button
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#55f6b1] px-4 py-2.5 text-sm font-semibold text-[#06110c]"
            onClick={() => query.refetch()}
            type="button"
          >
            <RotateCcw size={15} /> Try again
          </button>
        </div>
      </main>
    );
  }

  const analysis = query.data;
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
      <AddressHeader
        address={analysis.address}
        addressType={analysis.addressType}
        isRefreshing={query.isFetching}
        onRefresh={() => {
          refreshNext.current = true;
          void query.refetch({
            cancelRefetch: true,
          });
        }}
      />
      <div className="mt-6 space-y-4">
        <AddressStats analysis={analysis} />
        {analysis.summary.transactionCount === 0 ? (
          <div className="flex items-center gap-3 rounded-xl border border-[#29404e] bg-[#0c1720] px-4 py-3 text-sm text-[#91a6b5]">
            <DatabaseZap className="text-[#55f6b1]" size={18} />
            This address has no indexed transactions yet. Its live balance is still shown.
          </div>
        ) : null}
        <div className="flex items-center justify-between pt-5">
          <div>
            <p className="eyebrow">Flow intelligence</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Address network
            </h2>
          </div>
          <p className="hidden text-xs text-[#667989] sm:block">
            {analysis.nodes.length} nodes · {analysis.edges.length} connections
          </p>
        </div>
        <AnalysisDashboard analysis={analysis} key={analysis.generatedAt} />
        <div className="grid gap-4 pt-2 lg:grid-cols-[0.75fr_1.25fr]">
          <WalletDna analysis={analysis} />
          <div className="panel rounded-xl p-5">
            <p className="eyebrow">Analysis window</p>
            <div className="mt-4 grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-[#687b8b]">First visible activity</p>
                <p className="mt-2 text-sm font-medium">
                  {analysis.summary.firstActivityAt
                    ? formatDate(analysis.summary.firstActivityAt)
                    : "No activity"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#687b8b]">Last visible activity</p>
                <p className="mt-2 text-sm font-medium">
                  {analysis.summary.lastActivityAt
                    ? formatDate(analysis.summary.lastActivityAt)
                    : "No activity"}
                </p>
              </div>
            </div>
            <p className="mt-5 border-t border-[#1d2a36] pt-4 text-[11px] leading-5 text-[#5f7282]">
              Live Arc Testnet data. Activity dates and connection totals reflect the bounded explorer analysis window.
            </p>
          </div>
        </div>
        <TokenBalances balances={analysis.tokenBalances} />
        <TransactionTable analysis={analysis} />
      </div>
    </main>
  );
}

function AnalysisSkeleton() {
  return (
    <main className="mx-auto max-w-7xl animate-pulse px-5 py-10 lg:px-8">
      <div className="h-20 rounded-xl bg-[#101821]" />
      <div className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="h-28 rounded-xl bg-[#101821]" key={index} />
        ))}
      </div>
      <div className="mt-10 h-[520px] rounded-xl bg-[#101821]" />
    </main>
  );
}
