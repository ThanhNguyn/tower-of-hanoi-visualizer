import { motion } from "framer-motion";

interface DiskProps {
  disk: number;
  totalDisks: number;
  isTop: boolean;
  isSelected: boolean;
  isInteractive: boolean;
  onClick?: () => void;
  onDragStart?: () => void;
}

// Tailored color palette for disks 1 to 8: elegant copper, amber, bronze, slate gradients
const DISK_COLORS: Record<number, { bg: string; border: string; text: string; glow: string }> = {
  1: { bg: "from-amber-400 to-amber-500", border: "border-amber-300/80", text: "text-amber-950", glow: "rgba(251,191,36,0.3)" },
  2: { bg: "from-copper-300 to-copper-400", border: "border-copper-200/80", text: "text-[#191512]", glow: "rgba(242,202,154,0.3)" },
  3: { bg: "from-orange-400 to-copper-500", border: "border-orange-300/80", text: "text-amber-950", glow: "rgba(249,115,22,0.3)" },
  4: { bg: "from-rose-500 to-rose-600", border: "border-rose-300/70", text: "text-rose-100", glow: "rgba(244,63,94,0.3)" },
  5: { bg: "from-indigo-400 to-indigo-600", border: "border-indigo-300/70", text: "text-indigo-100", glow: "rgba(99,102,241,0.3)" },
  6: { bg: "from-cyan-500 to-blue-600", border: "border-cyan-300/70", text: "text-cyan-100", glow: "rgba(6,182,212,0.3)" },
  7: { bg: "from-teal-500 to-emerald-600", border: "border-teal-300/70", text: "text-teal-100", glow: "rgba(20,184,166,0.3)" },
  8: { bg: "from-slate-500 to-slate-700", border: "border-slate-300/60", text: "text-slate-100", glow: "rgba(148,163,184,0.3)" }
};

export function Disk({
  disk,
  totalDisks,
  isTop,
  isSelected,
  isInteractive,
  onClick,
  onDragStart
}: DiskProps) {
  // Width percentage calculation: scales neatly from 30% for disk 1 to 96% for disk totalDisks
  const minWidthPct = 28;
  const maxWidthPct = 96;
  const widthPct =
    totalDisks === 1
      ? 60
      : minWidthPct + ((disk - 1) / (totalDisks - 1)) * (maxWidthPct - minWidthPct);

  const styleConfig = DISK_COLORS[disk] || DISK_COLORS[8];

  return (
    <motion.div
      layout
      layoutId={`hanoi-disk-${disk}`}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 28,
        mass: 0.8
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: isSelected ? 1.04 : 1,
        y: isSelected ? -10 : 0,
        opacity: 1
      }}
      whileHover={isInteractive && isTop ? { scale: 1.02 } : {}}
      draggable={isInteractive && isTop}
      onDragStartCapture={(e: React.DragEvent<HTMLDivElement>) => {
        if (!isInteractive || !isTop) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("text/plain", String(disk));
        onDragStart?.();
      }}
      onClick={(e) => {
        if (isInteractive && isTop) {
          e.stopPropagation();
          onClick?.();
        }
      }}
      className={`relative z-10 flex h-7 sm:h-8 items-center justify-center rounded-lg border bg-gradient-to-r shadow-md transition-shadow select-none ${
        styleConfig.bg
      } ${styleConfig.border} ${
        isSelected
          ? "ring-2 ring-signal-blue ring-offset-2 ring-offset-ink-950 shadow-[0_0_18px_rgba(134,183,255,0.6)]"
          : isInteractive && isTop
          ? "cursor-grab active:cursor-grabbing hover:shadow-lg"
          : "cursor-default"
      }`}
      style={{
        width: `${widthPct}%`,
        boxShadow: isSelected
          ? "0 0 16px rgba(134, 183, 255, 0.7)"
          : `0 4px 10px -2px ${styleConfig.glow}`
      }}
      title={`Disk ${disk}${isTop ? " (Top disk)" : ""}`}
      aria-label={`Disk ${disk} of size ${disk}`}
    >
      {/* Sleek metallic highlight reflex */}
      <div className="absolute inset-x-2 top-0.5 h-[2px] rounded-full bg-white/40" />

      {/* Disk index badge */}
      <span
        className={`data-value text-xs font-bold leading-none tracking-tight ${styleConfig.text}`}
      >
        {disk}
      </span>
    </motion.div>
  );
}
