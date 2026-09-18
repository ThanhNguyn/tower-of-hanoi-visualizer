import React from "react";
import { motion } from "framer-motion";

interface DiskProps {
  disk: number;
  totalDisks: number;
  leftPercent: number; // e.g. 16.66%, 50%, 83.33%
  bottomPx: number; // e.g. 32 + slot * 34
  isTop: boolean;
  isSelected: boolean;
  isInteractive: boolean;
  isHinted?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
}

// Refined metallic palette for disks 1 to 8: Gold, Copper, Bronze, Amber, Cobalt, Emerald, Ruby, Obsidian
const DISK_COLORS: Record<
  number,
  {
    gradient: string;
    border: string;
    text: string;
    shadow: string;
    glow: string;
  }
> = {
  1: {
    gradient: "from-[#ffd166] via-[#f7b731] to-[#e18e11]",
    border: "border-[#ffeaa7]/90",
    text: "text-[#2d1b00]",
    shadow: "shadow-[0_4px_12px_rgba(255,209,102,0.35)]",
    glow: "#f7b731"
  },
  2: {
    gradient: "from-[#f2ca9a] via-[#e7ad72] to-[#c77d38]",
    border: "border-[#fceddb]/90",
    text: "text-[#2b1805]",
    shadow: "shadow-[0_4px_12px_rgba(231,173,114,0.35)]",
    glow: "#e7ad72"
  },
  3: {
    gradient: "from-[#ff9f43] via-[#ee5253] to-[#c0392b]",
    border: "border-[#ffbe76]/90",
    text: "text-white",
    shadow: "shadow-[0_4px_12px_rgba(238,82,83,0.35)]",
    glow: "#ee5253"
  },
  4: {
    gradient: "from-[#fd79a8] via-[#e84393] to-[#a41d63]",
    border: "border-[#ffaacb]/90",
    text: "text-white",
    shadow: "shadow-[0_4px_12px_rgba(232,67,147,0.35)]",
    glow: "#e84393"
  },
  5: {
    gradient: "from-[#a29bfe] via-[#6c5ce7] to-[#4834d4]",
    border: "border-[#dcdde1]/90",
    text: "text-white",
    shadow: "shadow-[0_4px_12px_rgba(108,92,231,0.35)]",
    glow: "#6c5ce7"
  },
  6: {
    gradient: "from-[#74b9ff] via-[#0984e3] to-[#1b4db1]",
    border: "border-[#b5dcff]/90",
    text: "text-white",
    shadow: "shadow-[0_4px_12px_rgba(9,132,227,0.35)]",
    glow: "#0984e3"
  },
  7: {
    gradient: "from-[#55efc4] via-[#00b894] to-[#017b62]",
    border: "border-[#b8ffed]/90",
    text: "text-[#002f23]",
    shadow: "shadow-[0_4px_12px_rgba(0,184,148,0.35)]",
    glow: "#00b894"
  },
  8: {
    gradient: "from-[#636e72] via-[#2d3436] to-[#1e272e]",
    border: "border-[#b2bec3]/80",
    text: "text-slate-100",
    shadow: "shadow-[0_4px_12px_rgba(0,0,0,0.5)]",
    glow: "#636e72"
  }
};

export function Disk({
  disk,
  totalDisks,
  leftPercent,
  bottomPx,
  isTop,
  isSelected,
  isInteractive,
  isHinted,
  onClick,
  onDragStart
}: DiskProps) {
  // Proportional disk width: scales neatly from 26% to 92% of the rod column width
  const minWidthPx = 54;
  const maxWidthPx = 220;
  const widthPx =
    totalDisks <= 1
      ? 120
      : Math.round(minWidthPx + ((disk - 1) / (totalDisks - 1)) * (maxWidthPx - minWidthPx));

  const styleConfig = DISK_COLORS[disk] || DISK_COLORS[8];

  return (
    <motion.div
      layout={false}
      initial={false}
      animate={{
        left: `${leftPercent}%`,
        bottom: `${bottomPx + (isSelected ? 24 : 0)}px`,
        scale: isSelected ? 1.06 : isHinted ? [1, 1.04, 1] : 1
      }}
      transition={{
        left: { type: "spring", stiffness: 320, damping: 26 },
        bottom: { type: "spring", stiffness: 340, damping: 26 },
        scale: { duration: 0.2 }
      }}
      whileHover={isInteractive && isTop ? { scale: isSelected ? 1.06 : 1.03 } : {}}
      draggable={isInteractive && isTop}
      onDragStartCapture={(e: React.DragEvent<HTMLDivElement>) => {
        if (!isInteractive || !isTop) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("text/plain", String(disk));
        onDragStart?.(e);
      }}
      onClick={(e) => {
        if (isInteractive && isTop) {
          e.stopPropagation();
          onClick?.();
        }
      }}
      className={`absolute z-20 flex h-7 sm:h-8 items-center justify-center rounded-lg border bg-gradient-to-r select-none transition-shadow ${
        styleConfig.gradient
      } ${styleConfig.border} ${styleConfig.shadow} ${
        isSelected
          ? "ring-2 ring-signal-blue ring-offset-2 ring-offset-ink-950 shadow-[0_0_20px_rgba(134,183,255,0.8)] z-30"
          : isHinted
          ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-ink-950 shadow-[0_0_18px_rgba(251,191,36,0.7)]"
          : isInteractive && isTop
          ? "cursor-grab active:cursor-grabbing hover:brightness-110"
          : "cursor-default"
      }`}
      style={{
        width: `${widthPx}px`,
        transform: "translateX(-50%)"
      }}
      title={`Đĩa ${disk}${isTop ? " (Đĩa trên cùng)" : ""}`}
      aria-label={`Đĩa ${disk}`}
    >
      {/* Sleek metallic highlight bevel */}
      <div className="absolute inset-x-2 top-0.5 h-[2px] rounded-full bg-white/50 pointer-events-none" />

      {/* Disk Number Pill */}
      <span
        className={`font-mono text-xs font-bold leading-none tracking-tight ${styleConfig.text}`}
      >
        {disk}
      </span>
    </motion.div>
  );
}
