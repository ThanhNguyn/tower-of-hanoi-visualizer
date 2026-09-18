import { BookOpen, GraduationCap, PlayCircle, RotateCcw, Swords, Volume2, VolumeX } from "lucide-react";
import type { AppMode } from "../types/hanoi";

interface HeaderProps {
  mode: AppMode;
  isMuted: boolean;
  onModeChange: (mode: AppMode) => void;
  onToggleSound: () => void;
  onOpenRules: () => void;
  onReset: () => void;
}

const modes: Array<{
  id: AppMode;
  label: string;
  description: string;
  icon: typeof Swords;
}> = [
  { id: "play", label: "Play", description: "Solve the puzzle manually", icon: Swords },
  { id: "solve", label: "Solve", description: "Watch automated algorithm simulation", icon: PlayCircle },
  { id: "learn", label: "Learn", description: "Deep-dive into recursion & complexity", icon: GraduationCap }
];

export function Header({
  mode,
  isMuted,
  onModeChange,
  onToggleSound,
  onOpenRules,
  onReset
}: HeaderProps) {
  return (
    <header className="mb-5 flex flex-col gap-4 border-b border-white/[0.08] pb-5 lg:mb-7 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-copper-500 text-[#191512] shadow-[0_10px_24px_-12px_rgba(231,173,114,0.95)]"
        >
          <span className="font-mono text-base font-bold">H</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-[-0.035em] text-white sm:text-2xl">
              Tower of Hanoi Visualizer
            </h1>
            <span className="rounded bg-copper-400/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-copper-300 border border-copper-400/30">
              DSA Visualizer
            </span>
          </div>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
            Explore the mathematics of recursion, iterative state machines, and Gray codes.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Mode Navigation */}
        <nav aria-label="Learning mode" className="instrument-well flex items-center p-1">
          {modes.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === mode;

            return (
              <button
                aria-pressed={isActive}
                className={`mode-button ${isActive ? "mode-button-active" : ""}`}
                key={item.id}
                onClick={() => onModeChange(item.id)}
                title={item.description}
                type="button"
              >
                <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Rules & Guide Button */}
        <button
          className="control-button border-white/[0.12] bg-white/[0.04] text-slate-200 hover:text-white"
          onClick={onOpenRules}
          type="button"
          title="View game rules and the legend of 64 golden disks"
        >
          <BookOpen size={16} className="text-copper-400" />
          <span className="hidden sm:inline">Rules & Guide</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          className="control-button control-button-quiet text-slate-400 hover:text-white"
          onClick={onToggleSound}
          type="button"
          title={isMuted ? "Unmute sound" : "Mute sound"}
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
        >
          {isMuted ? <VolumeX size={17} className="text-signal-red" /> : <Volume2 size={17} className="text-signal-green" />}
        </button>

        {/* Reset Button */}
        <button
          className="control-button control-button-quiet text-slate-300 hover:text-white"
          onClick={onReset}
          type="button"
          title="Reset entire state"
        >
          <RotateCcw aria-hidden="true" size={16} />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
}
