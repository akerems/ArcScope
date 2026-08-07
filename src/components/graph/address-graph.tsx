"use client";

import { useEffect, useRef, useState } from "react";
import cytoscape, { type Core, type EventObject } from "cytoscape";
import { Maximize2 } from "lucide-react";
import type { GraphEdge, GraphNode } from "@/types/graph";
import { shortenAddress } from "@/lib/utils/address";

type AddressGraphProps = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedId: string;
  onSelect: (node: GraphNode) => void;
};

export function AddressGraph({ nodes, edges, selectedId, onSelect }: AddressGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<Core | null>(null);
  const [hovered, setHovered] = useState<{
    node: GraphNode;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const core = cytoscape({
      container: containerRef.current,
      elements: [
        ...nodes.map((node) => ({
          data: {
            ...node,
            shortLabel: node.type === "target" ? "YOU" : node.label.length > 18 ? shortenAddress(node.address) : node.label,
            size: Math.min(66, 32 + Math.sqrt(node.transactionCount) * 3.4),
          },
        })),
        ...edges.map((edge) => ({
          data: { ...edge, width: Math.min(6, 1.2 + Math.sqrt(edge.transactionCount) * 0.45) },
        })),
      ],
      style: [
        {
          selector: "node",
          style: {
            width: "data(size)",
            height: "data(size)",
            label: "data(shortLabel)",
            "font-size": 8,
            "font-weight": 600,
            color: "#cbd7df",
            "text-valign": "bottom",
            "text-margin-y": 9,
            "background-color": "#142431",
            "border-color": "#4b6b7f",
            "border-width": 1.5,
            "overlay-opacity": 0,
          },
        },
        {
          selector: 'node[type = "target"]',
          style: {
            shape: "ellipse",
            "background-color": "#55f6b1",
            "border-color": "#b6ffdc",
            "border-width": 3,
            color: "#f5fff9",
            "font-size": 9,
          },
        },
        {
          selector: 'node[type = "contract"]',
          style: { shape: "round-rectangle", "background-color": "#172b3e", "border-color": "#59a9ff" },
        },
        {
          selector: 'node[type = "bridge"]',
          style: { shape: "diamond", "background-color": "#203233", "border-color": "#55f6b1" },
        },
        {
          selector: 'node[type = "token"]',
          style: { shape: "hexagon", "background-color": "#2b2638", "border-color": "#a787ff" },
        },
        {
          selector: "node:selected",
          style: { "border-color": "#ffffff", "border-width": 3 },
        },
        {
          selector: "edge",
          style: {
            width: "data(width)",
            "line-color": "#29465a",
            "target-arrow-color": "#5f88a0",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "arrow-scale": 0.75,
            opacity: 0.76,
            "overlay-opacity": 0,
          },
        },
        {
          selector: 'edge[direction = "incoming"]',
          style: { "line-color": "#276857", "target-arrow-color": "#55f6b1" },
        },
      ],
      layout: { name: "cose", animate: false, padding: 48, nodeRepulsion: () => 9000, idealEdgeLength: () => 120 },
      minZoom: 0.45,
      maxZoom: 2.2,
    });

    core.on("tap", "node", (event: EventObject) => {
      const node = nodes.find((item) => item.id === event.target.id());
      if (node) onSelect(node);
    });
    core.on("mouseover", "node", (event: EventObject) => {
      const node = nodes.find((item) => item.id === event.target.id());
      const position = event.target.renderedPosition();
      if (node) setHovered({ node, x: position.x, y: position.y });
    });
    core.on("mouseout", "node", () => setHovered(null));
    core.on("pan zoom", () => setHovered(null));
    coreRef.current = core;
    return () => {
      core.destroy();
      coreRef.current = null;
    };
  }, [edges, nodes, onSelect]);

  useEffect(() => {
    const core = coreRef.current;
    if (!core) return;
    core.$("node").unselect();
    core.getElementById(selectedId).select();
  }, [selectedId]);

  return (
    <div className="relative h-[520px] min-h-[420px] overflow-hidden rounded-xl border border-[#1d2a36] bg-[#080e14]">
      <div className="pointer-events-none absolute left-4 top-4 z-10">
        <p className="eyebrow">Connection map</p>
        <p className="mt-1 text-xs text-[#687b8b]">Click a node to inspect</p>
      </div>
      <button
        aria-label="Fit graph to screen"
        className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-lg border border-[#273744] bg-[#0c141c] text-[#8ca0af] transition hover:text-white"
        onClick={() => coreRef.current?.fit(undefined, 48)}
        type="button"
      >
        <Maximize2 size={15} />
      </button>
      <div className="h-full w-full" ref={containerRef} />
      {hovered ? (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-lg border border-[#314552] bg-[#0b141c] px-3 py-2 shadow-xl"
          style={{ left: hovered.x, top: hovered.y }}
        >
          <p className="text-xs font-semibold">{hovered.node.label}</p>
          <p className="mt-1 font-mono text-[9px] text-[#778b9b]">
            {shortenAddress(hovered.node.address || hovered.node.id)}
          </p>
          <p className="mt-1 text-[9px] text-[#55f6b1]">
            {hovered.node.transactionCount} transactions
          </p>
        </div>
      ) : null}
      <div className="pointer-events-none absolute bottom-4 left-4 flex gap-4 text-[10px] font-semibold uppercase tracking-wider text-[#667a8a]">
        <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-[#55f6b1]" /> Incoming</span>
        <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-[#4d7895]" /> Outgoing</span>
      </div>
    </div>
  );
}
