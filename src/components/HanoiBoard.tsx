import { useMemo } from "react";
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

const ROD_CONFIGS: Array<{ id: RodType; label: string; role: string; roleColor: string }> = [
  { id: "A", label: "PEG A", role: "Source", roleColor: "text-amber-400 bg-amber-400/15 border-amber-400/30" },
  { id: "B", label: "PEG B", role: "Auxiliary", roleColor: "text-sky-400 bg-sky-400/15 border-sky-400/30" },
  { id: "C", label: "PEG C", role: "Target", roleColor: "text-emerald-400 bg-emerald-400/15 border-emerald-400/30" }
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
  // Calculated vertical metrics guaranteeing zero overlap and comfortable breathing room
  const poleHeight = Math.max(180, totalDisks * 32 + 40);
  const hoverTopY = poleHeight + 36;
  const boardHeight = hoverTopY + 80;

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
      className="relative w-full rounded-2xl border border-white/[0.1] bg-[#0a0f18] p-6 shadow-2xl overflow-hidden select-none"
      style={{ minHeight: `${boardHeight}px` }}
    >
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 90%, rgba(231,173,114,0.07), transparent 75%)"
        }}
      />

      {/* Top Peg Identifiers (Cleanly spaced, zero text overlap) */}
      <div className="relative z-10 grid grid-cols-3 gap-4 mb-3">
        {ROD_CONFIGS.map(({ id, label, role, roleColor }) => {
          const isSelected = selectedRod === id;
          const isHintTarget = hintMove?.to === id;
          const count = rods[id].length;

          return (
            <div
              key={id}
              onClick={() => isInteractive && onSelectRod(id)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${
                isSelected
                  ? "bg-signal-blue/10 ring-1 ring-signal-blue/50"
                  : isHintTarget
                  ? "bg-amber-400/10 ring-1 ring-amber-400/40"
                  : "bg-white/[0.02] hover:bg-white/[0.04]"
              } ${isInteractive ? "cursor-pointer" : "cursor-default"}`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-slate-200">
                  {label}
                </span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-widest ${roleColor}`}
                >
                  {role}
                </span>
              </div>
              <span className="mt-1 font-mono text-[10px] text-slate-400">
                {count} {count === 1 ? "disk" : "disks"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Interactive Peg Dropping & Clicking Column Zones */}
      <div className="absolute inset-x-6 top-24 bottom-12 grid grid-cols-3 gap-4">
        {ROD_CONFIGS.map(({ id }) => {
          const isSelected = selectedRod === id;
          const isShaking = shakeRod === id;
          const isHintTarget = hintMove?.to === id;

          return (
            <div
              key={id}
              onClick={() => isInteractive && onSelectRod(id)}
              onDragOver={(e) => isInteractive && e.preventDefault()}
              onDrop={(e) => {
                if (!isInteractive) return;
                e.preventDefault();
                const diskStr = e.dataTransfer.getData("text/plain");
                if (diskStr && selectedRod) {
                  onDropDisk?.(selectedRod, id);
                }
              }}
              className={`relative flex flex-col items-center justify-end rounded-xl transition-all ${
                isShaking ? "animate-shake" : ""
              } ${
                isSelected
                  ? "bg-signal-blue/[0.04]"
                  : isHintTarget
                  ? "bg-amber-400/[0.04]"
                  : "hover:bg-white/[0.015]"
              } ${isInteractive ? "cursor-pointer" : "cursor-default"}`}
            >
              {/* Solid Polished Metallic Peg Pole */}
              <div
                className={`w-3 sm:w-3.5 rounded-t-full transition-all duration-300 shadow-md ${
                  isSelected
                    ? "bg-gradient-to-b from-signal-blue via-slate-200 to-slate-400 shadow-[0_0_16px_rgba(134,183,255,0.8)]"
                    : isHintTarget
                    ? "bg-gradient-to-b from-amber-300 via-slate-300 to-slate-500 shadow-[0_0_14px_rgba(251,191,36,0.6)]"
                    : "bg-gradient-to-b from-slate-400 via-slate-600 to-slate-800"
                }`}
                style={{ height: `${poleHeight}px` }}
              />

              {/* Milled Steel Socket Collar at base of peg */}
              <div
                className={`h-2.5 w-12 sm:w-16 rounded-full border transition-all mt-[-2px] ${
                  isSelected
                    ? "border-signal-blue bg-signal-blue/30 shadow-[0_0_10px_rgba(134,183,255,0.5)]"
                    : "border-white/[0.15] bg-slate-800"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Disks Layer: Unified coordinate plane with 3-stage arc motion */}
      <div className="absolute inset-x-6 top-24 bottom-12 pointer-events-none">
        {allDisks.map((diskNum) => {
          const pos = diskPositions[diskNum];
          if (!pos) return null;

          const isSelected = selectedRod === pos.rod && pos.isTop;
          const isHinted = hintMove?.disk === diskNum;

          return (
            <div key={diskNum} className="pointer-events-auto">
              <Disk
                disk={diskNum}
                totalDisks={totalDisks}
                currentRod={pos.rod}
                currentSlot={pos.slot}
                hoverTopY={hoverTopY}
                rodCenters={ROD_CENTERS}
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

      {/* Heavy Obsidian & Brass Base Pedestal */}
      <div className="absolute inset-x-6 bottom-3 flex flex-col items-center pointer-events-none">
        <div className="h-4 w-full rounded-lg border border-white/[0.14] bg-gradient-to-r from-ink-900 via-slate-800 to-ink-900 shadow-xl" />
        <div className="mt-1 flex items-center justify-between w-full px-4 text-[9px] font-mono tracking-wider text-slate-500">
          <span>ORIGIN PEG (A)</span>
          <span>BUFFER PEG (B)</span>
          <span>DESTINATION PEG (C)</span>
        </div>
      </div>
    </div>
  );
}
