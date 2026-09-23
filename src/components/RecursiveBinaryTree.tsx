import { useMemo, useRef, useEffect, useState } from "react";
import type { Rod } from "../types/hanoi";
import { useLanguage } from "../i18n/LanguageContext";
import { GitBranch, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export interface HanoiTreeNode {
  id: string;
  step: number;
  disk: number;
  from: Rod;
  to: Rod;
  aux: Rod;
  depth: number;
  x: number;
  y: number;
  left?: HanoiTreeNode;
  right?: HanoiTreeNode;
}

interface RecursiveBinaryTreeProps {
  diskCount: number;
  currentStep: number;
  totalSteps?: number;
  onSelectStep: (step: number) => void;
}

const DISK_ACCENT_COLORS: Record<number, string> = {
  1: "#f59e0b",
  2: "#ea580c",
  3: "#e11d48",
  4: "#9333ea",
  5: "#2563eb",
  6: "#059669",
  7: "#65a30d",
  8: "#64748b"
};

export function RecursiveBinaryTree({
  diskCount,
  currentStep,
  onSelectStep
}: RecursiveBinaryTreeProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  // Auto-cap rendered depth for massive disk counts (n > 5) to keep vector tree ultra-responsive
  const maxDisplayN = Math.min(diskCount, 5);

  const { flatNodes, lines, width, height } = useMemo(() => {
    // Node dimensions & layout constants
    const nodeHeight = 36;
    const levelHeight = 64;
    const totalLeaves = Math.pow(2, maxDisplayN - 1);
    const leafGap = Math.max(92, 110 - maxDisplayN * 4);
    const treeWidth = Math.max(760, totalLeaves * leafGap);
    const treeHeight = maxDisplayN * levelHeight + 70;

    let stepCounter = 0;

    function buildTree(
      n: number,
      src: Rod = "A",
      aux: Rod = "B",
      dst: Rod = "C",
      depth = 0
    ): HanoiTreeNode {
      let leftNode: HanoiTreeNode | undefined;
      if (n > 1) {
        leftNode = buildTree(n - 1, src, dst, aux, depth + 1);
      }

      stepCounter++;
      const step = stepCounter;

      // X coordinate directly mapped to in-order index
      const totalStepsInTree = Math.pow(2, maxDisplayN) - 1;
      const x = (step / (totalStepsInTree + 1)) * treeWidth;
      const y = 36 + depth * levelHeight;

      const node: HanoiTreeNode = {
        id: `tree-node-${step}`,
        step,
        disk: n,
        from: src,
        to: dst,
        aux,
        depth,
        x,
        y,
        left: leftNode
      };

      if (n > 1) {
        node.right = buildTree(n - 1, aux, src, dst, depth + 1);
      }

      return node;
    }

    const root = buildTree(maxDisplayN, "A", "B", "C", 0);

    const allNodes: HanoiTreeNode[] = [];
    const allLines: Array<{ fromX: number; fromY: number; toX: number; toY: number; isActive: boolean }> = [];

    function traverse(node: HanoiTreeNode) {
      allNodes.push(node);
      if (node.left) {
        allLines.push({
          fromX: node.x,
          fromY: node.y + nodeHeight / 2,
          toX: node.left.x,
          toY: node.left.y - nodeHeight / 2,
          isActive: currentStep >= node.left.step
        });
        traverse(node.left);
      }
      if (node.right) {
        allLines.push({
          fromX: node.x,
          fromY: node.y + nodeHeight / 2,
          toX: node.right.x,
          toY: node.right.y - nodeHeight / 2,
          isActive: currentStep >= node.right.step
        });
        traverse(node.right);
      }
    }

    traverse(root);

    return {
      tree: root,
      flatNodes: allNodes,
      lines: allLines,
      width: treeWidth,
      height: treeHeight
    };
  }, [maxDisplayN]);

  // Center scroll on active node
  useEffect(() => {
    if (!containerRef.current) return;
    const activeNode = flatNodes.find((n) => n.step === currentStep);
    if (activeNode) {
      const targetLeft = activeNode.x * zoom - containerRef.current.clientWidth / 2;
      containerRef.current.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: "smooth"
      });
    }
  }, [currentStep, flatNodes, zoom]);

  const activeNode = flatNodes.find((n) => n.step === currentStep) ?? null;

  return (
    <div className="relative rounded-2xl border border-white/[0.1] bg-[#0c1017] shadow-xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] bg-[#111722]/80 px-4 py-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <GitBranch size={16} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              <span>{t("traceTreeTitle")}</span>
              <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                O(2ⁿ)
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {diskCount > 5
                ? t("treeSubtreeNotice", { n: maxDisplayN, total: diskCount })
                : t("treeClickPrompt")}
            </p>
          </div>
        </div>

        {/* Zoom & Navigation Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
            title={t("treeZoomOut")}
          >
            <ZoomOut size={13} />
          </button>
          <span className="font-mono text-[11px] text-slate-400 w-9 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
            title={t("treeZoomIn")}
          >
            <ZoomIn size={13} />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
            title={t("treeResetZoom")}
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Active Node Info Banner */}
      <div className="px-4 py-2 bg-[#090d14] border-b border-white/[0.06] flex flex-wrap items-center justify-between text-xs font-mono gap-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">{t("currentExecutionFrame")}:</span>
          {activeNode ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
              {t("treeStepDisk", {
                step: activeNode.step,
                disk: activeNode.disk,
                from: activeNode.from,
                to: activeNode.to
              })}
            </span>
          ) : (
            <span className="text-slate-400 italic">{t("idle")}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>{t("treeLegendCompleted")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>{t("treeLegendActive")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-600" />
            <span>{t("treeLegendPending")}</span>
          </div>
        </div>
      </div>

      {/* SVG Tree Canvas Scroll Container */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto overflow-y-hidden p-4 select-none cursor-grab active:cursor-grabbing"
        style={{ maxHeight: "380px" }}
      >
        <div
          style={{
            width: `${width * zoom}px`,
            height: `${height * zoom}px`,
            transformOrigin: "top left",
            transition: "width 0.15s ease, height 0.15s ease"
          }}
        >
          <svg
            width={width * zoom}
            height={height * zoom}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
          >
            <defs>
              {/* Glow filter for active node */}
              <filter id="node-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connecting Branches (Bezier Curves) */}
            {lines.map((line, idx) => {
              const midY = (line.fromY + line.toY) / 2;
              const pathData = `M ${line.fromX} ${line.fromY} C ${line.fromX} ${midY}, ${line.toX} ${midY}, ${line.toX} ${line.toY}`;
              return (
                <path
                  key={`line-${idx}`}
                  d={pathData}
                  fill="none"
                  stroke={line.isActive ? "rgba(52, 211, 153, 0.45)" : "rgba(255, 255, 255, 0.1)"}
                  strokeWidth={line.isActive ? 2 : 1.25}
                  strokeDasharray={line.isActive ? undefined : "3 3"}
                  className="transition-colors duration-300"
                />
              );
            })}

            {/* Tree Nodes */}
            {flatNodes.map((node) => {
              const isCurrent = node.step === currentStep;
              const isPassed = node.step < currentStep;
              const diskColor = DISK_ACCENT_COLORS[node.disk] || "#64748b";

              const rectWidth = 76;
              const rectHeight = 32;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => onSelectStep(node.step)}
                  className="cursor-pointer group"
                >
                  {/* Active glowing aura halo */}
                  {isCurrent && (
                    <rect
                      x={-rectWidth / 2 - 4}
                      y={-rectHeight / 2 - 4}
                      width={rectWidth + 8}
                      height={rectHeight + 8}
                      rx={18}
                      fill="rgba(245, 158, 11, 0.15)"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      filter="url(#node-glow)"
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Pill Surface */}
                  <rect
                    x={-rectWidth / 2}
                    y={-rectHeight / 2}
                    width={rectWidth}
                    height={rectHeight}
                    rx={14}
                    fill={
                      isCurrent
                        ? "#1a160c"
                        : isPassed
                        ? "#0a1714"
                        : "#111622"
                    }
                    stroke={
                      isCurrent
                        ? "#f59e0b"
                        : isPassed
                        ? "rgba(52, 211, 153, 0.55)"
                        : "rgba(255, 255, 255, 0.14)"
                    }
                    strokeWidth={isCurrent ? 2 : 1.2}
                    className="transition-all duration-200 group-hover:brightness-125"
                  />

                  {/* Disk Color Indicator Dot */}
                  <circle
                    cx={-rectWidth / 2 + 12}
                    cy={0}
                    r={4}
                    fill={diskColor}
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth={1}
                  />

                  {/* Step and Move Info */}
                  <text
                    x={-rectWidth / 2 + 22}
                    y={-1}
                    fill={isCurrent ? "#fde68a" : isPassed ? "#a7f3d0" : "#94a3b8"}
                    fontSize={10}
                    fontWeight="700"
                    fontFamily="monospace"
                    textAnchor="start"
                    dominantBaseline="middle"
                  >
                    #{node.step}
                  </text>

                  <text
                    x={-rectWidth / 2 + 22}
                    y={9}
                    fill={isCurrent ? "#ffffff" : isPassed ? "#6ee7b7" : "#cbd5e1"}
                    fontSize={9}
                    fontWeight="600"
                    fontFamily="monospace"
                    textAnchor="start"
                    dominantBaseline="middle"
                  >
                    {node.from}→{node.to}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
