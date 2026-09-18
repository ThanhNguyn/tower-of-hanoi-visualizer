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

const ROD_CONFIGS: Array<{ id: RodType; label: string; role: string }> = [
  { id: "A", label: "Peg A", role: "Source" },
  { id: "B", label: "Peg B", role: "Auxiliary" },
  { id: "C", label: "Peg C", role: "Target" }
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
  const boardHeight = hoverTopY + 84;

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
      className="relative w-full rounded-2xl border border-white/[0.08] bg-[#0d0f15] p-6 shadow-2xl overflow-hidden select-none"
      style={{ minHeight: `${boardHeight}px` }}
    >
      {/* Subtle warm ambient table light */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% 95%, rgba(245, 158, 11, 0.08), transparent 75%)"
        }}
      />

      {/* Top Peg Identifiers (Clean, dignified, zero text collision) */}
      <div className="relative z-10 grid grid-cols-3 gap-4 mb-2">
        {ROD_CONFIGS.map(({ id, label, role }) => {
          const isSelected = selectedRod === id;
          const isHintTarget = hintMove?.to === id;
          const count = rods[id].length;

          return (
            <div
              key={id}
              onClick={() => isInteractive && onSelectRod(id)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${
                isSelected
                  ? "bg-sky-500/10 ring-1 ring-sky-400/40"
                  : isHintTarget
                  ? "bg-amber-400/10 ring-1 ring-amber-400/40"
                  : "bg-white/[0.02] hover:bg-white/[0.04]"
              } ${isInteractive ? "cursor-pointer" : "cursor-default"}`}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs sm:text-sm text-slate-200">
                  {label}
                </span>
                <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                  {role}
                </span>
              </div>
              <span className="mt-0.5 font-mono text-[11px] text-slate-500">
                {count} {count === 1 ? "disk" : "disks"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Interactive Peg Zones and Poles */}
      <div className="absolute inset-x-6 top-20 bottom-10 grid grid-cols-3 gap-4 pointer-events-none">
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
              className={`relative flex flex-col items-center justify-end rounded-xl transition-all pointer-events-auto ${
                isShaking ? "animate-shake" : ""
              } ${
                isSelected
                  ? "bg-sky-500/[0.04]"
                  : isHintTarget
                  ? "bg-amber-400/[0.04]"
                  : "hover:bg-white/[0.02]"
              } ${isInteractive ? "cursor-pointer" : "cursor-default"}`}
            >
              {/* Solid 3D Polished Stainless Steel Peg Pole */}
              <div
                className={`w-3.5 sm:w-4 rounded-t-full transition-all duration-300 shadow-md ${
                  isSelected
                    ? "ring-2 ring-sky-400/80"
                    : isHintTarget
                    ? "ring-2 ring-amber-400/80"
                    : ""
                }`}
                style={{
                  height: `${poleHeight}px`,
                  background:
                    "linear-gradient(90deg, #2d3340 0%, #475569 25%, #94a3b8 50%, #475569 75%, #1e2430 100%)",
                  boxShadow:
                    "0 2px 8px rgba(0, 0, 0, 0.5), inset 1px 0 1px rgba(255, 255, 255, 0.4)"
                }}
              />

              {/* Milled Steel Socket Collar - sits flush on top of base plinth */}
              <div
                className={`h-2.5 w-12 sm:w-14 rounded-full border transition-all ${
                  isSelected
                    ? "border-sky-400 bg-sky-500/30"
                    : "border-white/[0.15] bg-[#1a1e29]"
                }`}
                style={{
                  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Disks Layer: Unified coordinate plane with 3-stage arc motion */}
      <div className="absolute inset-x-6 top-20 bottom-10 pointer-events-none">
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

      {/* Solid Milled Dark Plinth Base - perfectly aligned with collars and disks */}
      <div className="absolute inset-x-6 bottom-4 flex flex-col items-center pointer-events-none">
        <div
          className="h-6 w-full rounded-xl border border-white/[0.12] shadow-xl"
          style={{
            background:
              "linear-gradient(180deg, #252a38 0%, #171a24 50%, #0d0f15 100%)",
            boxShadow:
              "0 10px 24px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.25)"
          }}
        />
      </div>
    </div>
  );
}


