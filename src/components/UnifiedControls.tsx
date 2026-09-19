import {
  Cpu,
  FastForward,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Undo2
} from "lucide-react";
import type { AlgorithmType, Rod } from "../types/hanoi";
import { useLanguage } from "../i18n/LanguageContext";

interface UnifiedControlsProps {
  // Manual game props
  selectedRod: Rod | null;
  message: string | null;
  isSolved: boolean;
  moveCount: number;
  onUndo: () => void;
  onHint: () => void;
  onReset: () => void;

  // Simulation props
  algorithm: AlgorithmType;
  step: number;
  totalSteps: number;
  speed: number;
  isPlaying: boolean;
  onAlgorithmChange: (algo: AlgorithmType) => void;
  onFirst: () => void;
  onPrevious: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onLast: () => void;
  onSpeedChange: (speed: number) => void;
}

const SPEED_OPTIONS = [0.5, 1, 2, 4];

export function UnifiedControls({
  selectedRod,
  message,
  isSolved,
  moveCount,
  onUndo,
  onHint,
  onReset,
  algorithm,
  step,
  totalSteps,
  speed,
  isPlaying,
  onAlgorithmChange,
  onFirst,
  onPrevious,
  onTogglePlay,
  onNext,
  onLast,
  onSpeedChange
}: UnifiedControlsProps) {
  const { t } = useLanguage();

  const algorithmsList = [
    { id: "recursive" as AlgorithmType, label: t("algoRecursive"), desc: t("algoRecursiveDesc") },
    { id: "iterative" as AlgorithmType, label: t("algoIterative"), desc: t("algoIterativeDesc") },
    { id: "binary" as AlgorithmType, label: t("algoBinary"), desc: t("algoBinaryDesc") }
  ];

  const isError = message?.startsWith("Invalid") || message?.startsWith("Nước đi không hợp lệ");
  const isHint = message?.startsWith("Hint") || message?.startsWith("Gợi ý");

  return (
    <section aria-label="Game and Solver Controls" className="rounded-2xl border border-white/[0.08] bg-[#0d0f15] p-4 shadow-xl space-y-3">
      {/* Tier 1: Primary Action Triggers (Manual & Playback) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        {/* Left: Manual Play Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 text-xs font-semibold text-amber-300 transition hover:bg-amber-400/20 active:scale-95 disabled:opacity-40 whitespace-nowrap"
            onClick={onHint}
            disabled={isSolved || isPlaying}
            type="button"
            title={t("hintTitle")}
          >
            <Lightbulb size={14} />
            <span>{t("hint")}</span>
          </button>

          <button
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 text-xs font-medium text-slate-200 transition hover:bg-white/[0.08] hover:text-white active:scale-95 disabled:opacity-40 whitespace-nowrap"
            disabled={moveCount === 0 || isSolved || isPlaying}
            onClick={onUndo}
            type="button"
            title={t("undoTitle")}
          >
            <Undo2 size={14} />
            <span>{t("undo")}</span>
          </button>

          <button
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white active:scale-95 whitespace-nowrap"
            onClick={onReset}
            type="button"
            title={t("resetTitle")}
          >
            <RotateCcw size={14} />
            <span>{t("reset")}</span>
          </button>
        </div>

        {/* Right: Auto-Solver Transport Playback Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            aria-label={t("firstStep")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-30 shrink-0"
            disabled={step === 0}
            onClick={onFirst}
            type="button"
            title={t("firstStep")}
          >
            <FastForward className="rotate-180" size={14} />
          </button>

          <button
            aria-label={t("prevStep")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-30 shrink-0"
            disabled={step === 0}
            onClick={onPrevious}
            type="button"
            title={t("prevStep")}
          >
            <SkipBack size={14} />
          </button>

          {/* Auto Solve / Pause Play Button */}
          <button
            aria-label={isPlaying ? t("pauseTitle") : t("autoSolveTitle")}
            className={`inline-flex h-9 items-center gap-2 rounded-lg px-3.5 sm:px-4 text-xs font-bold transition shadow-md active:scale-95 whitespace-nowrap shrink-0 ${
              isPlaying
                ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                : "bg-white text-slate-950 hover:bg-slate-200"
            }`}
            onClick={onTogglePlay}
            type="button"
            title={isPlaying ? t("pauseTitle") : t("autoSolveTitle")}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
            <span>{isPlaying ? t("pause") : t("autoSolve")}</span>
          </button>

          <button
            aria-label={t("nextStep")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-30 shrink-0"
            disabled={step === totalSteps}
            onClick={onNext}
            type="button"
            title={t("nextStep")}
          >
            <SkipForward size={14} />
          </button>

          <button
            aria-label={t("lastStep")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-30 shrink-0"
            disabled={step === totalSteps}
            onClick={onLast}
            type="button"
            title={t("lastStep")}
          >
            <FastForward size={14} />
          </button>
        </div>
      </div>

      {/* Tier 2: Algorithm Selector, Status Prompt & Simulation Speed */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Algorithm selector pills */}
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.02] p-1">
          <Cpu size={14} className="text-amber-400 ml-1.5 mr-0.5 shrink-0" />
          {algorithmsList.map((algo) => (
            <button
              key={algo.id}
              type="button"
              onClick={() => onAlgorithmChange(algo.id)}
              title={algo.desc}
              className={`rounded px-2.5 py-1 text-xs font-medium transition whitespace-nowrap ${
                algorithm === algo.id
                  ? "bg-amber-400/20 text-amber-300 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {algo.label}
            </button>
          ))}
        </div>

        {/* Dynamic status hint */}
        <span className="hidden md:inline text-xs text-slate-400">
          {isSolved
            ? t("statusSolved")
            : selectedRod
            ? t("statusSelected", { rod: selectedRod })
            : t("statusIdle")}
        </span>

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-slate-400 text-[11px] whitespace-nowrap">{t("speed")}</span>
          <div className="flex items-center rounded-lg border border-white/[0.08] bg-white/[0.02] p-0.5">
            {SPEED_OPTIONS.map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => onSpeedChange(spd)}
                className={`rounded px-2 py-0.5 text-[11px] font-mono transition ${
                  speed === spd
                    ? "bg-white/10 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message notification if any */}
      {message && (
        <div
          aria-live="polite"
          className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
            isError
              ? "border border-rose-500/30 bg-rose-500/10 text-rose-300"
              : isHint
              ? "border border-amber-400/30 bg-amber-400/10 text-amber-200 font-semibold"
              : "border border-sky-400/30 bg-sky-400/10 text-sky-200"
          }`}
        >
          {message}
        </div>
      )}
    </section>
  );
}

