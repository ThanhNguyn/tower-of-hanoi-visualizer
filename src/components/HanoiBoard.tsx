import { useMemo } from "react";
import type { HanoiRods, Rod as RodType } from "../types/hanoi";
import { Disk } from "./Disk";
import { sound } from "../utils/audio";
import { useLanguage } from "../i18n/LanguageContext";

interface HanoiBoardProps {
  rods: HanoiRods;
  totalDisks: number;
  selectedRod: RodType | null;
  shakeRod?: RodType | null;
  hintMove?: { from: RodType; to: RodType; disk: number } | null;
  isInteractive: boolean;
  speed?: number;
  onSelectRod: (rod: RodType) => void;
  onDropDisk?: (fromRod: RodType, toRod: RodType) => void;
}

const ROD_CENTERS: Record<RodType, number> = {
  A: 16.666,
  B: 50.0,
  C: 83.333
};

export function HanoiBoard({
  rods,
  totalDisks,
  selectedRod,
  shakeRod,
  hintMove,
  isInteractive,
  speed = 1,
  onSelectRod,
  onDropDisk
}: HanoiBoardProps) {
  const { t } = useLanguage();

  const rodConfigs = useMemo<Array<{ id: RodType; label: string; role: string }>>(() => [
    { id: "A", label: t("pegA"), role: t("roleSource") },
    { id: "B", label: t("pegB"), role: t("roleAuxiliary") },
    { id: "C", label: t("pegC"), role: t("roleTarget") }
  ], [t]);

  // Guaranteed collision-free vertical metrics
  const poleHeight = Math.max(180, totalDisks * 34 + 30);
  const hoverTopY = poleHeight + 22;
  const stageHeight = hoverTopY + 50;

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
    <div className="relative w-full rounded-2xl border border-white/[0.1] bg-[#0a0e17] p-5 shadow-2xl select-none">
      {/* Top Peg Identifiers Bar - Completely separated from flight stage */}
      <div className="grid grid-cols-3 gap-3 mb-6 relative z-30">
        {rodConfigs.map(({ id, label, role }) => {
          const isSelected = selectedRod === id;
          const isHintTarget = hintMove?.to === id;
          const count = rods[id].length;

          return (
            <div
              key={id}
              onClick={() => isInteractive && onSelectRod(id)}
              className={`flex flex-col items-center py-2.5 px-3 rounded-xl border transition-all ${
                isSelected
                  ? "bg-sky-500/15 border-sky-400 text-sky-200 shadow-md ring-1 ring-sky-400/50"
                  : isHintTarget
                  ? "bg-amber-500/15 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400/50 animate-pulse"
                  : "bg-white/[0.03] border-white/[0.08] text-slate-300 hover:bg-white/[0.06] hover:border-white/[0.14]"
              } ${isInteractive ? "cursor-pointer" : "cursor-default"}`}
            >
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                <span className="font-bold text-xs sm:text-sm text-slate-100 whitespace-nowrap">
                  {label}
                </span>
                <span className="rounded bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-mono text-slate-400 whitespace-nowrap">
                  {role}
                </span>
              </div>
              <span className="mt-1 font-mono text-[11px] text-slate-400">
                {count} {count === 1 ? t("diskSingular") : t("diskPlural")}
              </span>
            </div>
          );
        })}
      </div>

      {/* 2D Stage Container: Disks & Poles */}
      <div
        className="relative w-full rounded-xl bg-[#070a10]/80 border border-white/[0.06] overflow-hidden"
        style={{ height: `${stageHeight}px` }}
      >
        {/* Subtle warm ambient table light */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 90%, rgba(245, 158, 11, 0.1), transparent 75%)"
          }}
        />

        {/* Interactive Peg Drop Zones and Poles */}
        <div className="absolute inset-x-4 inset-y-0 grid grid-cols-3 gap-4 pointer-events-none">
          {rodConfigs.map(({ id }) => {
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
                className={`relative flex flex-col items-center justify-end pb-5 transition-all pointer-events-auto ${
                  isShaking ? "animate-shake" : ""
                } ${
                  isSelected
                    ? "bg-sky-500/[0.05]"
                    : isHintTarget
                    ? "bg-amber-400/[0.05]"
                    : "hover:bg-white/[0.02]"
                } ${isInteractive ? "cursor-pointer" : "cursor-default"}`}
              >
                {/* 3D Cylindrical Peg Pole with realistic metallic highlights */}
                <div
                  className={`w-3.5 sm:w-4 rounded-t-full transition-all duration-300 shadow-md ${
                    isSelected
                      ? "ring-2 ring-sky-400/80 shadow-sky-500/20"
                      : isHintTarget
                      ? "ring-2 ring-amber-400/80 shadow-amber-500/20"
                      : ""
                  }`}
                  style={{
                    height: `${poleHeight}px`,
                    background:
                      "linear-gradient(90deg, #1e2530 0%, #475569 25%, #cbd5e1 50%, #475569 75%, #1e2530 100%)",
                    boxShadow:
                      "0 2px 10px rgba(0, 0, 0, 0.6), inset 1px 0 1px rgba(255, 255, 255, 0.4)"
                  }}
                />

                {/* Milled Brass Socket Collar */}
                <div
                  className={`h-2.5 w-12 sm:w-14 rounded-full border transition-all ${
                    isSelected
                      ? "border-sky-400 bg-sky-500/30"
                      : "border-amber-400/40 bg-[#221810]"
                  }`}
                  style={{
                    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.3)"
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Disks Layer */}
        <div className="absolute inset-x-4 inset-y-0 pb-5 pointer-events-none">
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
                  speed={speed}
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

        {/* Crafted Solid Wooden Base Plinth */}
        <div className="absolute inset-x-3 bottom-0 h-6 flex flex-col items-center pointer-events-none">
          <div
            className="h-full w-full rounded-t-lg border-t border-x border-white/[0.14]"
            style={{
              background:
                "linear-gradient(180deg, #2b1f17 0%, #1a120c 60%, #0d0906 100%)",
              boxShadow:
                "0 -2px 10px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.25)"
            }}
          />
        </div>
      </div>
    </div>
  );
}
