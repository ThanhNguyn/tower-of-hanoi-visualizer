import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Rod as RodType } from "../types/hanoi";
import { useLanguage } from "../i18n/LanguageContext";

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
  speed?: number;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
}

// Tactile mineral & architectural palette: authentic, dignified, zero artificial neon glow

const DISK_COLORS: Record<
  number,
  {
    bg: string;
    border: string;
    text: string;
  }
> = {
  1: {
    bg: "linear-gradient(180deg, #f59e0b 0%, #d97706 100%)",
    border: "rgba(254, 243, 199, 0.35)",
    text: "#ffffff"
  },
  2: {
    bg: "linear-gradient(180deg, #ea580c 0%, #c2410c 100%)",
    border: "rgba(255, 237, 213, 0.35)",
    text: "#ffffff"
  },
  3: {
    bg: "linear-gradient(180deg, #e11d48 0%, #be123c 100%)",
    border: "rgba(255, 228, 230, 0.35)",
    text: "#ffffff"
  },
  4: {
    bg: "linear-gradient(180deg, #9333ea 0%, #7e22ce 100%)",
    border: "rgba(243, 232, 255, 0.35)",
    text: "#ffffff"
  },
  5: {
    bg: "linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)",
    border: "rgba(219, 234, 254, 0.35)",
    text: "#ffffff"
  },
  6: {
    bg: "linear-gradient(180deg, #0d9488 0%, #0f766e 100%)",
    border: "rgba(204, 251, 241, 0.35)",
    text: "#ffffff"
  },
  7: {
    bg: "linear-gradient(180deg, #65a30d 0%, #4d7c0f 100%)",
    border: "rgba(236, 252, 203, 0.35)",
    text: "#ffffff"
  },
  8: {
    bg: "linear-gradient(180deg, #475569 0%, #334155 100%)",
    border: "rgba(241, 245, 249, 0.35)",
    text: "#ffffff"
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
  speed = 1,
  onClick,
  onDragStart
}: DiskProps) {
  const { t } = useLanguage();
  const targetBottom = 3 + currentSlot * 32;
  const targetLeft = rodCenters[currentRod];

  // Ref to track previous location for smooth parabolic arc
  const prevLocRef = useRef<{ rod: RodType; bottom: number }>({
    rod: currentRod,
    bottom: targetBottom
  });
  const wasSelectedRef = useRef(false);

  const prevLoc = prevLocRef.current;
  const wasSelected = wasSelectedRef.current;
  const hasMovedRod = prevLoc.rod !== currentRod;

  useEffect(() => {
    prevLocRef.current = {
      rod: currentRod,
      bottom: targetBottom
    };
    wasSelectedRef.current = isSelected;
  }, [currentRod, targetBottom, isSelected]);

  // Width calculation: neatly scaled from 56px to 224px
  const minWidthPx = 56;
  const maxWidthPx = 224;
  const widthPx =
    totalDisks <= 1
      ? 120
      : Math.round(minWidthPx + ((disk - 1) / (totalDisks - 1)) * (maxWidthPx - minWidthPx));

  const styleConfig = DISK_COLORS[disk] || DISK_COLORS[8];

  // Dynamic animation duration adapted to current playback speed
  const moveInterval = Math.max(120, Math.round(700 / (speed || 1)));
  const animDuration = Math.max(0.12, Math.min(0.85, (moveInterval * 0.82) / 1000));

  let animateLeft: string | string[];
  let animateBottom: string | string[];
  let transitionConfig: Record<string, unknown>;

  if (isSelected) {
    // Hovering above rod waiting for destination click - gentle tactile lift
    animateLeft = `${targetLeft}%`;
    animateBottom = `${hoverTopY}px`;
    transitionConfig = {
      bottom: { type: "spring", stiffness: 360, damping: 25 },
      left: { duration: 0.16 }
    };
  } else if (hasMovedRod) {
    const prevLeft = rodCenters[prevLoc.rod];

    if (wasSelected) {
      // Manual play: Disk is ALREADY floating at hoverTopY!
      // Silky glide across at hover altitude, then smooth landing into slot
      animateLeft = [`${prevLeft}%`, `${targetLeft}%`, `${targetLeft}%`];
      animateBottom = [`${hoverTopY}px`, `${hoverTopY}px`, `${targetBottom}px`];
      transitionConfig = {
        duration: 0.44,
        times: [0, 0.58, 1],
        ease: "easeInOut"
      };
    } else {
      // Autonomous simulation: 3-stage fluid arc
      // 1. Vertical lift -> 2. Horizontal glide -> 3. Soft drop
      animateLeft = [`${prevLeft}%`, `${prevLeft}%`, `${targetLeft}%`, `${targetLeft}%`];
      animateBottom = [`${prevLoc.bottom}px`, `${hoverTopY}px`, `${hoverTopY}px`, `${targetBottom}px`];
      transitionConfig = {
        duration: animDuration,
        times: [0, 0.28, 0.72, 1],
        ease: "easeInOut"
      };
    }
  } else {
    // Resting in peg stack or smoothly returning when deselected
    animateLeft = `${targetLeft}%`;
    animateBottom = `${targetBottom}px`;
    transitionConfig = {
      bottom: { type: "spring", stiffness: 360, damping: 26 },
      left: { duration: 0.18 }
    };
  }

  return (
    <motion.div
      initial={false}
      animate={{
        x: "-50%",
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
      className={`absolute z-20 flex h-7 sm:h-8 items-center justify-center rounded-lg border select-none transition-shadow ${
        isSelected
          ? "ring-2 ring-sky-400 ring-offset-2 ring-offset-[#0c0d12] z-30"
          : isHinted
          ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0c0d12] z-30"
          : isInteractive && isTop
          ? "cursor-grab active:cursor-grabbing hover:brightness-105"
          : "cursor-default"
      }`}
      style={{
        width: `${widthPx}px`,
        background: styleConfig.bg,
        borderColor: styleConfig.border,
        boxShadow: isSelected
          ? "0 8px 24px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(56, 189, 248, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.45)"
          : isHinted
          ? "0 6px 20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(251, 191, 36, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.45)"
          : "0 4px 10px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 -2px 0 rgba(0, 0, 0, 0.25)"
      }}
      title={`${t("diskTooltip")} ${disk}${isTop ? ` ${t("topDisk")}` : ""}`}
      aria-label={`${t("diskTooltip")} ${disk}`}
    >
      {/* Specular top-edge bevel highlight */}
      <div className="absolute inset-x-2 top-0.5 h-[2px] rounded-full bg-white/55 pointer-events-none" />

      {/* Bottom chamfer shadow shelf */}
      <div className="absolute inset-x-0 bottom-0 h-1.5 rounded-b-lg bg-black/35 pointer-events-none" />

      {/* Tactile Center Peg Hole Ring */}
      <div className="flex items-center justify-center z-10">
        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white/25 bg-black/40 shadow-inner">
          <span className="font-mono text-xs font-bold leading-none tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {disk}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

