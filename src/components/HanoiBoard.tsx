import { useMemo } from "react";
import { motion } from "framer-motion";
import type { HanoiRods, Rod as RodType } from "../types/hanoi";
import { Disk } from "./Disk";
import { sound } from "../utils/audio";

interface HanoiBoardProps {
  rods: HanoiRods;
  totalDisks: number;
  selectedRod: RodType | null;
  shakeRod: RodType | null;
  hintMove?: { from: RodType; to: RodType; disk: number } | null;
  isInteractive: boolean;
  onSelectRod: (rod: RodType) => void;
  onDropDisk?: (fromRod: RodType, toRod: RodType) => void;
}

const ROD_CENTERS: Record<RodType, number> = {
  A: 16.666,
  B: 50.0,
  C: 83.333
};

const ROD_INFO: Array<{ id: RodType; label: string; roleEn: string; roleVi: string }> = [
  { id: "A", label: "Cọc A", roleEn: "Source", roleVi: "Nguồn" },
  { id: "B", label: "Cọc B", roleEn: "Auxiliary", roleVi: "Trung Gian" },
  { id: "C", label: "Cọc C", roleEn: "Target", roleVi: "Đích" }
];

export function HanoiBoard({
  rods,
  totalDisks,
  selectedRod,
  shakeRod,
  hintMove,
  isInteractive,
  onSelectRod,
  onDropDisk
}: HanoiBoardProps) {
  // Height dynamic to accommodate up to 8 disks + headroom
  const boardHeight = Math.max(320, totalDisks * 34 + 140);
  const poleHeight = Math.max(200, totalDisks * 33 + 60);

  // Map each disk to its current rod and slot index
  const diskPositions = useMemo(() => {
    const positions: Record<number, { rod: RodType; slot: number; isTop: boolean }> = {};

    (["A", "B", "C"] as RodType[]).forEach((rodId) => {
      const rodDisks = rods[rodId];
      rodDisks.forEach((diskNum, slotIdx) => {
        positions[diskNum] = {
          rod: rodId,
          slot: slotIdx,
          isTop: slotIdx === rodDisks.length - 1
        };
      });
    });

    return positions;
  }, [rods]);

  const allDisks = useMemo(() => {
    const list: number[] = [];
    for (let i = 1; i <= totalDisks; i++) {
      list.push(i);
    }
    return list;
  }, [totalDisks]);

  return (
    <div
      className="relative w-full rounded-2xl border border-white/[0.09] bg-[#0c121b] p-4 sm:p-6 shadow-2xl overflow-hidden select-none"
      style={{ minHeight: `${boardHeight + 40}px` }}
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(231,173,114,0.08), transparent 75%)"
        }}
      />

      {/* 3 Rod Columns Background Interaction Zones */}
      <div className="absolute inset-x-4 sm:inset-x-6 top-6 bottom-14 grid grid-cols-3 gap-3 pointer-events-auto">
        {ROD_INFO.map(({ id, label, roleVi }) => {
          const isSelected = selectedRod === id;
          const isShaking = shakeRod === id;
          const isHintTarget = hintMove?.to === id;
          const diskCount = rods[id].length;

          return (
            <motion.div
              key={id}
              animate={
                isShaking
                  ? {
                      x: [0, -12, 12, -8, 8, -4, 4, 0],
                      transition: { duration: 0.5, ease: "easeInOut" }
                    }
                  : { x: 0 }
              }
              onClick={() => {
                if (isInteractive) {
                  onSelectRod(id);
                }
              }}
              onDragOver={(e) => {
                if (!isInteractive) return;
                e.preventDefault();
              }}
              onDrop={(e) => {
                if (!isInteractive) return;
                e.preventDefault();
                const diskStr = e.dataTransfer.getData("text/plain");
                if (diskStr && selectedRod) {
                  onDropDisk?.(selectedRod, id);
                }
              }}
              className={`relative flex flex-col items-center justify-between rounded-xl border p-3 transition-all ${
                isSelected
                  ? "border-signal-blue bg-signal-blue/[0.08] shadow-[0_0_24px_rgba(134,183,255,0.2)] ring-1 ring-signal-blue"
                  : isHintTarget
                  ? "border-amber-400/80 bg-amber-400/[0.08] ring-1 ring-amber-400/50"
                  : "border-white/[0.06] bg-ink-900/40 hover:border-white/[0.14] hover:bg-white/[0.02]"
              } ${isInteractive ? "cursor-pointer" : "cursor-default"}`}
            >
              {/* Header Label */}
              <div className="flex flex-col items-center pointer-events-none">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs sm:text-sm font-semibold text-white">
                    {label}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider ${
                      id === "A"
                        ? "bg-copper-400/20 text-copper-300"
                        : id === "C"
                        ? "bg-signal-green/20 text-signal-green"
                        : "bg-white/[0.08] text-slate-400"
                    }`}
                  >
                    {roleVi}
                  </span>
                </div>
                <span className="mt-0.5 font-mono text-[11px] text-slate-500">
                  {diskCount} đĩa
                </span>
              </div>

              {/* Vertical Metallic Rod Pole */}
              <div
                className={`absolute bottom-2 w-3 sm:w-3.5 rounded-t-full transition-all ${
                  isSelected
                    ? "bg-gradient-to-b from-signal-blue via-slate-300 to-slate-500 shadow-[0_0_14px_rgba(134,183,255,0.7)]"
                    : "bg-gradient-to-b from-slate-400 via-slate-600 to-slate-800"
                }`}
                style={{ height: `${poleHeight}px` }}
              />

              {/* Base Pedestal Pill */}
              <div
                className={`h-3 w-4/5 rounded-md border transition-colors ${
                  isSelected
                    ? "border-signal-blue/60 bg-signal-blue/25"
                    : "border-white/[0.1] bg-slate-800/80"
                }`}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Disks Layer: Unified coordinate plane */}
      <div className="absolute inset-x-4 sm:inset-x-6 top-6 bottom-14 pointer-events-none">
        {allDisks.map((diskNum) => {
          const pos = diskPositions[diskNum];
          if (!pos) return null;

          const leftPercent = ROD_CENTERS[pos.rod];
          const bottomPx = 18 + pos.slot * 34;
          const isSelected = selectedRod === pos.rod && pos.isTop;
          const isHinted = hintMove?.disk === diskNum;

          return (
            <div key={diskNum} className="pointer-events-auto">
              <Disk
                disk={diskNum}
                totalDisks={totalDisks}
                leftPercent={leftPercent}
                bottomPx={bottomPx}
                isTop={pos.isTop}
                isSelected={isSelected}
                isInteractive={isInteractive}
                isHinted={isHinted}
                onClick={() => {
                  if (isInteractive) {
                    onSelectRod(pos.rod);
                  }
                }}
                onDragStart={() => {
                  sound.playPickup();
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Heavy Foundation Pedestal Slab */}
      <div className="absolute inset-x-4 sm:inset-x-6 bottom-3 flex flex-col items-center">
        <div className="h-3.5 w-full rounded-lg border border-white/[0.12] bg-gradient-to-r from-ink-800 via-slate-700 to-ink-800 shadow-inner" />
        <div className="mt-1 flex items-center justify-between w-full px-2 text-[10px] font-mono text-slate-500">
          <span>NGUỒN (A)</span>
          <span>TRUNG GIAN (B)</span>
          <span>ĐÍCH (C)</span>
        </div>
      </div>
    </div>
  );
}
