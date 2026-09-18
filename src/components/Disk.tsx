import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Rod as RodType } from "../types/hanoi";

interface DiskProps {
  disk: number;
  totalDisks: number;
  currentRod: RodType;
  currentSlot: number;
  hoverTopY: number;
  rodCenters: Record<RodType, number>;
  isTop: boolean;
  isSelected: boolean;
  isInteractive: boolean;
  isHinted?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
}

// Sleek, high-contrast metallic color styling for disks 1 to 8
const DISK_COLORS: Record<
  number,
  {
    gradient: string;
    border: string;
    text: string;
    glow: string;
  }
> = {
  1: {
    gradient: "from-amber-400 via-yellow-400 to-amber-500",
    border: "border-yellow-200/90",
    text: "text-amber-950",
    glow: "rgba(250, 204, 21, 0.4)"
  },
  2: {
    gradient: "from-[#f2ca9a] via-[#e7ad72] to-[#cf844c]",
    border: "border-[#fdeddc]/90",
    text: "text-[#2b1805]",
    glow: "rgba(231, 173, 114, 0.4)"
  },
  3: {
    gradient: "from-rose-500 via-rose-600 to-red-700",
    border: "border-rose-200/90",
    text: "text-white",
    glow: "rgba(244, 63, 94, 0.4)"
  },
  4: {
    gradient: "from-fuchsia-500 via-purple-600 to-purple-800",
    border: "border-purple-200/90",
    text: "text-white",
    glow: "rgba(168, 85, 247, 0.4)"
  },
  5: {
    gradient: "from-indigo-500 via-indigo-600 to-blue-800",
    border: "border-indigo-200/90",
    text: "text-white",
    glow: "rgba(99, 102, 241, 0.4)"
  },
  6: {
    gradient: "from-sky-400 via-blue-500 to-blue-700",
    border: "border-sky-200/90",
    text: "text-white",
    glow: "rgba(14, 165, 233, 0.4)"
  },
  7: {
    gradient: "from-emerald-400 via-teal-500 to-teal-700",
    border: "border-emerald-200/90",
    text: "text-emerald-950",
    glow: "rgba(16, 185, 129, 0.4)"
  },
  8: {
    gradient: "from-slate-500 via-slate-600 to-slate-800",
    border: "border-slate-300/80",
    text: "text-slate-100",
    glow: "rgba(100, 116, 139, 0.4)"
  }
};

export function Disk({
  disk,
  totalDisks,
  currentRod,
  currentSlot,
  hoverTopY,
  rodCenters,
  isTop,
  isSelected,
  isInteractive,
  isHinted,
  onClick,
  onDragStart
}: DiskProps) {
  const targetBottom = 16 + currentSlot * 32;
  const targetLeft = rodCenters[currentRod];

  // Ref to track previous location for smooth parabolic arc
  const prevLocRef = useRef<{ rod: RodType; bottom: number }>({
    rod: currentRod,
    bottom: targetBottom
  });

  const prevLoc = prevLocRef.current;
  const hasMovedRod = prevLoc.rod !== currentRod;

  useEffect(() => {
    prevLocRef.current = {
      rod: currentRod,
      bottom: targetBottom
    };
  }, [currentRod, targetBottom]);

  // Width calculation: neatly scaled from 60px to 220px
  const minWidthPx = 56;
  const maxWidthPx = 224;
  const widthPx =
    totalDisks <= 1
      ? 120
      : Math.round(minWidthPx + ((disk - 1) / (totalDisks - 1)) * (maxWidthPx - minWidthPx));

  const styleConfig = DISK_COLORS[disk] || DISK_COLORS[8];

  // 3-Stage Arc Animation Definition:
  // If moving rods: (fromLeft, fromBottom) -> (fromLeft, hoverTopY) -> (toLeft, hoverTopY) -> (toLeft, toBottom)
  // If selected: hover at hoverTopY
  // If resting: sit at (targetLeft, targetBottom)
  let animateLeft: string | string[];
  let animateBottom: string | string[];
  let transitionConfig: Record<string, unknown>;

  if (isSelected) {
    // Hovering above rod waiting for destination click
    animateLeft = `${targetLeft}%`;
    animateBottom = `${hoverTopY}px`;
    transitionConfig = {
      bottom: { type: "spring", stiffness: 350, damping: 25 },
      left: { duration: 0.2 }
    };
  } else if (hasMovedRod) {
    // Parabolic 3-stage keyframe: LIFT -> GLIDE -> LOWER
    const prevLeft = rodCenters[prevLoc.rod];
    animateLeft = [`${prevLeft}%`, `${prevLeft}%`, `${targetLeft}%`, `${targetLeft}%`];
    animateBottom = [`${prevLoc.bottom}px`, `${hoverTopY}px`, `${hoverTopY}px`, `${targetBottom}px`];
    transitionConfig = {
      duration: 0.42,
      times: [0, 0.28, 0.72, 1],
      ease: ["easeInOut", "easeInOut", "easeOut"]
    };
  } else {
    // Resting in peg stack
    animateLeft = `${targetLeft}%`;
    animateBottom = `${targetBottom}px`;
    transitionConfig = {
      bottom: { type: "spring", stiffness: 340, damping: 26 },
      left: { duration: 0.2 }
    };
  }

  return (
    <motion.div
      initial={false}
      animate={{
        left: animateLeft,
        bottom: animateBottom,
        scale: isSelected ? 1.05 : isHinted ? [1, 1.05, 1] : 1
      }}
      transition={transitionConfig}
      whileHover={isInteractive && isTop ? { scale: isSelected ? 1.05 : 1.03 } : {}}
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
      } ${styleConfig.border} ${
        isSelected
          ? "ring-2 ring-signal-blue ring-offset-2 ring-offset-ink-950 shadow-[0_0_24px_rgba(134,183,255,0.9)] z-30"
          : isHinted
          ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-ink-950 shadow-[0_0_20px_rgba(251,191,36,0.8)]"
          : isInteractive && isTop
          ? "cursor-grab active:cursor-grabbing hover:brightness-110 shadow-lg"
          : "cursor-default shadow-md"
      }`}
      style={{
        width: `${widthPx}px`,
        transform: "translateX(-50%)",
        boxShadow: isSelected
          ? "0 0 20px rgba(134, 183, 255, 0.85)"
          : `0 4px 14px -2px ${styleConfig.glow}`
      }}
      title={`Disk ${disk}${isTop ? " (Top disk)" : ""}`}
      aria-label={`Disk ${disk} of size ${disk}`}
    >
      {/* Metallic specular light reflex */}
      <div className="absolute inset-x-2 top-0.5 h-[2px] rounded-full bg-white/50 pointer-events-none" />

      {/* Disk Number Pill */}
      <span className={`font-mono text-xs font-bold leading-none tracking-tight ${styleConfig.text}`}>
        {disk}
      </span>
    </motion.div>
  );
}
