"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import type { AddressAnalysis } from "@/types/arc";
import type { GraphNode } from "@/types/graph";
import { AddressGraph } from "@/components/graph/address-graph";
import { NodeDetailsPanel } from "@/components/graph/node-details-panel";
import { fetchAddressAnalysis } from "@/lib/arc/api-client";
import { mergeAddressGraphs } from "@/lib/arc/graph-merge";

export function AnalysisDashboard({ analysis }: { analysis: AddressAnalysis }) {
  const queryClient = useQueryClient();
  const [graphAnalysis, setGraphAnalysis] = useState(analysis);
  const [selected, setSelected] = useState<GraphNode>(analysis.nodes[0]);
  const [expanded, setExpanded] = useState(() => new Set<string>());
  const [expandingId, setExpandingId] = useState<string | null>(null);
  const [expansionError, setExpansionError] = useState("");
  const [hops, setHops] = useState(
    () =>
      new Map(
        analysis.nodes.map((node) => [
          node.id.toLowerCase(),
          node.type === "target" ? 0 : 1,
        ]),
      ),
  );
  const handleSelect = useCallback((node: GraphNode) => setSelected(node), []);
  const selectedKey = selected.id.toLowerCase();
  const selectedHop = hops.get(selectedKey) ?? 2;
  const canExpand =
    Boolean(selected.address) &&
    selectedHop < 2 &&
    selected.type !== "target" &&
    !expanded.has(selectedKey);

  async function expandSelected() {
    if (!canExpand) return;
    setExpandingId(selected.id);
    setExpansionError("");
    try {
      const result = await queryClient.fetchQuery({
        queryKey: ["address-expansion", selected.address],
        queryFn: () => fetchAddressAnalysis(selected.address, { limit: 50 }),
        staleTime: Infinity,
      });
      setGraphAnalysis((current) => mergeAddressGraphs(current, result));
      setExpanded((current) => new Set(current).add(selectedKey));
      setHops((current) => {
        const next = new Map(current);
        for (const node of result.nodes) {
          const key = node.id.toLowerCase();
          if (!next.has(key)) next.set(key, Math.min(2, selectedHop + 1));
        }
        return next;
      });
    } catch {
      setExpansionError(
        "This node could not be expanded right now. Arcscan may be rate-limiting requests.",
      );
    } finally {
      setExpandingId(null);
    }
  }

  return (
    <motion.div
      className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <AddressGraph
        edges={graphAnalysis.edges}
        nodes={graphAnalysis.nodes}
        onSelect={handleSelect}
        selectedId={selected.id}
      />
      <NodeDetailsPanel
        canExpand={canExpand}
        edges={graphAnalysis.edges}
        isExpanding={expandingId === selected.id}
        node={selected}
        onExpand={expandSelected}
      />
      {expansionError ? (
        <p className="rounded-lg border border-amber-300/20 bg-amber-300/5 px-4 py-3 text-xs text-amber-100 lg:col-span-2">
          {expansionError}
        </p>
      ) : null}
    </motion.div>
  );
}
