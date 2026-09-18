import { BookOpen, RotateCcw, Volume2, VolumeX } from "lucide-react";

interface HeaderProps {
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenRules: () => void;
  onReset: () => void;
}

export function Header({
  isMuted,
  onToggleSound,
  onOpenRules,
  onReset
}: HeaderProps) {
  return (
    <header className="mb-4 flex flex-col gap-4 border-b border-white/[0.07] pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        <div
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-[#2a2e39] to-[#161820] text-amber-400 font-mono font-bold text-lg border border-white/[0.1] shadow-md"
        >
          H
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Tower of Hanoi
          </h1>
          <p className="text-xs text-slate-400">
            Interactive Recursion & Algorithm Visualizer · Divide & Conquer, State Machine, Gray Code
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Rules & Guide Button */}
        <button
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 text-xs font-medium text-slate-200 transition hover:bg-white/[0.08] hover:text-white"
          onClick={onOpenRules}
          type="button"
          title="View game rules, mathematical proof, and the legend of Hanoi"
        >
          <BookOpen size={15} className="text-amber-400/90" />
          <span>Rules & Guide</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
          onClick={onToggleSound}
          type="button"
          title={isMuted ? "Unmute audio" : "Mute audio"}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} className="text-emerald-400" />}
        </button>

        {/* Global Reset Button */}
        <button
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
          onClick={onReset}
          type="button"
          title="Reset board to starting configuration (R)"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
}
