import { useState } from "react";
import { motion } from "framer-motion";
import type { Rod as RodType } from "../types/hanoi";
import { Disk } from "./Disk";

interface RodProps {
  id: RodType;
  label: string;
  role: "Source" | "Auxiliary" | "Target";
  disks: number[]; // bottom to top
  totalDisks: number;
  isSelected: boolean;
  isShaking: boolean;
  isInteractive: boolean;
  onSelect: () => void;
  onDropDisk?: (fromRod: RodType) => void;
}

export function Rod({
  id,
  label,
  role,
  disks,
  totalDisks,
  isSelected,
  isShaking,
  isInteractive,
  onSelect,
  onDropDisk
}: RodProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const topDiskIndex = disks.length - 1;

  return (
    <motion.div
      animate={
        isShaking
          ? {
              x: [0, -10, 10, -8, 8, -4, 4, 0],
              transition: { duration: 0.5, ease: "easeInOut" }
            }
          : { x: 0 }
      }
      onClick={onSelect}
      onDragOver={(e) => {
        if (!isInteractive) return;
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        if (!isInteractive) return;
        e.preventDefault();
        setIsDragOver(false);
        const diskStr = e.dataTransfer.getData("text/plain");
        if (diskStr) {
          onDropDisk?.(id);
        }
      }}
      className={`group relative flex flex-col items-center justify-end rounded-xl border p-2 transition-all select-none ${
        isSelected
          ? "border-signal-blue bg-signal-blue/[0.07] shadow-[0_0_24px_rgba(134,183,255,0.15)] ring-1 ring-signal-blue"
          : isDragOver
          ? "border-copper-400 bg-copper-400/[0.08]"
          : "border-white/[0.08] bg-ink-900/50 hover:border-white/[0.16] hover:bg-white/[0.02]"
      } ${isInteractive ? "cursor-pointer" : "cursor-default"}`}
      style={{ minHeight: `${Math.max(260, totalDisks * 34 + 110)}px` }}
      role="region"
      aria-label={`${label} (${role}) containing ${disks.length} disks`}
    >
      {/* Rod Header Label */}
      <div className="absolute top-3 inset-x-2 flex flex-col items-center pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-sm font-semibold text-white">Rod {id}</span>
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider ${
              role === "Source"
                ? "bg-copper-400/20 text-copper-300"
                : role === "Target"
                ? "bg-signal-green/20 text-signal-green"
                : "bg-white/[0.07] text-slate-400"
            }`}
          >
            {role}
          </span>
        </div>
        <span className="mt-1 font-mono text-[11px] text-slate-500">
          {disks.length} {disks.length === 1 ? "disk" : "disks"}
        </span>
      </div>

      {/* Vertical Pole */}
      <div
        className={`absolute bottom-6 w-2.5 sm:w-3 rounded-t-full transition-colors ${
          isSelected
            ? "bg-gradient-to-b from-signal-blue via-slate-400 to-slate-600 shadow-[0_0_12px_rgba(134,183,255,0.6)]"
            : "bg-gradient-to-b from-slate-400 via-slate-600 to-slate-700"
        }`}
        style={{ height: `${Math.max(160, totalDisks * 32 + 40)}px` }}
      />

      {/* Disks Container (stacked vertically from bottom to top) */}
      <div className="relative z-10 flex w-full flex-col-reverse items-center gap-1 mb-2">
        {disks.map((disk, idx) => (
          <Disk
            key={disk}
            disk={disk}
            totalDisks={totalDisks}
            isTop={idx === topDiskIndex}
            isSelected={isSelected && idx === topDiskIndex}
            isInteractive={isInteractive}
            onClick={onSelect}
          />
        ))}
      </div>

      {/* Base Peg Pedestal */}
      <div
        className={`h-3 w-4/5 rounded-md border transition-colors ${
          isSelected
            ? "border-signal-blue/50 bg-signal-blue/20"
            : "border-white/[0.12] bg-slate-800/80"
        }`}
      />
    </motion.div>
  );
}
