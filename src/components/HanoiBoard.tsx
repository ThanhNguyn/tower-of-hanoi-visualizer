import type { HanoiRods, Rod as RodType } from "../types/hanoi";
import { Rod } from "./Rod";

interface HanoiBoardProps {
  rods: HanoiRods;
  totalDisks: number;
  selectedRod: RodType | null;
  shakeRod: RodType | null;
  isInteractive: boolean;
  onSelectRod: (rod: RodType) => void;
  onDropDisk?: (fromRod: RodType, toRod: RodType) => void;
}

export function HanoiBoard({
  rods,
  totalDisks,
  selectedRod,
  shakeRod,
  isInteractive,
  onSelectRod,
  onDropDisk
}: HanoiBoardProps) {
  const rodConfigs: Array<{ id: RodType; label: string; role: "Source" | "Auxiliary" | "Target" }> = [
    { id: "A", label: "Rod A", role: "Source" },
    { id: "B", label: "Rod B", role: "Auxiliary" },
    { id: "C", label: "Rod C", role: "Target" }
  ];

  return (
    <div className="relative w-full rounded-2xl border border-white/[0.08] bg-[#0c121b] p-4 sm:p-6 lg:p-7 shadow-2xl">
      {/* Board Environment Aura */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(231,173,114,0.06), transparent 70%)"
        }}
      />

      {/* Grid of 3 Rods */}
      <div className="relative grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {rodConfigs.map(({ id, label, role }) => (
          <Rod
            key={id}
            id={id}
            label={label}
            role={role}
            disks={rods[id]}
            totalDisks={totalDisks}
            isSelected={selectedRod === id}
            isShaking={shakeRod === id}
            isInteractive={isInteractive}
            onSelect={() => onSelectRod(id)}
            onDropDisk={(targetRod) => {
              if (selectedRod) {
                onDropDisk?.(selectedRod, targetRod);
              }
            }}
          />
        ))}
      </div>

      {/* Bottom Heavy Platform Slab */}
      <div className="mt-4 flex flex-col items-center">
        <div className="h-3 w-full rounded-lg border border-white/[0.1] bg-gradient-to-r from-ink-800 via-slate-700 to-ink-800 shadow-inner" />
        <div className="mt-1 flex items-center justify-between w-full px-2 text-[11px] font-mono text-slate-500">
          <span>SOURCE (START)</span>
          <span>AUXILIARY (BUFFER)</span>
          <span>TARGET (GOAL)</span>
        </div>
      </div>
    </div>
  );
}
