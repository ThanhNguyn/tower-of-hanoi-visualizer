import {
  Cpu,
  FastForward,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Undo2,
  Gauge
} from "lucide-react";
import type { AlgorithmType, Rod } from "../types/hanoi";
import { useLanguage } from "../i18n/LanguageContext";
import { sound } from "../utils/audio";

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
    <section
      aria-label="Arcade Controls Deck"
      className="rounded-2xl border border-white/[0.1] bg-[#0c1017] p-4 sm:p-5 shadow-2xl space-y-4 select-none"
    >
      {/* Top Deck: Dual-Bay Control Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Left Bay (5 cols): Manual Game Tactical Controls */}
        <div className="lg:col-span-5 flex flex-wrap items-center gap-2">
          {/* Hint Key */}
          <button
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-400/40 bg-gradient-to-b from-amber-500/20 to-amber-500/5 px-3.5 text-xs font-bold text-amber-300 shadow-md transition-all hover:brightness-125 hover:border-amber-400 active:translate-y-[2px] active:shadow-inner disabled:opacity-30 disabled:pointer-events-none"
            onClick={() => {
              sound.playClick();
              onHint();
            }}
            disabled={isSolved || isPlaying}
            type="button"
            title={t("hintTitle")}
          >
            <Lightbulb size={15} className="text-amber-400 animate-pulse" />
            <span>{t("hint")}</span>
          </button>

          {/* Undo Key */}
          <button
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.12] bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-3.5 text-xs font-semibold text-slate-200 shadow-md transition-all hover:border-white/[0.25] hover:text-white active:translate-y-[2px] active:shadow-inner disabled:opacity-30 disabled:pointer-events-none"
            disabled={moveCount === 0 || isSolved || isPlaying}
            onClick={() => {
              sound.playClick();
              onUndo();
            }}
            type="button"
            title={t("undoTitle")}
          >
            <Undo2 size={15} />
            <span>{t("undo")}</span>
          </button>

          {/* Reset Key */}
          <button
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-500/30 bg-gradient-to-b from-rose-500/15 to-rose-500/5 px-3.5 text-xs font-semibold text-rose-300 shadow-md transition-all hover:border-rose-400 hover:text-rose-200 active:translate-y-[2px] active:shadow-inner"
            onClick={() => {
              sound.playClick();
              onReset();
            }}
            type="button"
            title={t("resetTitle")}
          >
            <RotateCcw size={15} />
            <span>{t("reset")}</span>
          </button>
        </div>

        {/* Right Bay (7 cols): Autonomous Solver Transport Console */}
        <div className="lg:col-span-7 flex flex-wrap items-center justify-start lg:justify-end gap-2">
          {/* First Step */}
          <button
            aria-label={t("firstStep")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.12] bg-[#121824] text-slate-300 shadow-md transition hover:border-white/[0.25] hover:text-white active:translate-y-[2px] active:shadow-inner disabled:opacity-30 shrink-0"
            disabled={step === 0}
            onClick={() => {
              sound.playClick();
              onFirst();
            }}
            type="button"
            title={t("firstStep")}
          >
            <FastForward className="rotate-180" size={15} />
          </button>

          {/* Previous Step */}
          <button
            aria-label={t("prevStep")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.12] bg-[#121824] text-slate-300 shadow-md transition hover:border-white/[0.25] hover:text-white active:translate-y-[2px] active:shadow-inner disabled:opacity-30 shrink-0"
            disabled={step === 0}
            onClick={() => {
              sound.playClick();
              onPrevious();
            }}
            type="button"
            title={t("prevStep")}
          >
            <SkipBack size={15} />
          </button>

          {/* Play / Pause Giant Arcade Button */}
          <button
            aria-label={isPlaying ? t("pauseTitle") : t("autoSolveTitle")}
            className={`inline-flex h-10 items-center gap-2.5 rounded-xl px-5 text-xs font-black uppercase tracking-wider transition-all shadow-xl active:translate-y-[2px] active:shadow-inner whitespace-nowrap shrink-0 ${
              isPlaying
                ? "border border-amber-400 bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 shadow-amber-500/25 animate-pulse"
                : "border border-emerald-400 bg-gradient-to-b from-emerald-400 to-emerald-600 text-slate-950 shadow-emerald-500/25 hover:brightness-110"
            }`}
            onClick={() => {
              sound.playClick();
              onTogglePlay();
            }}
            type="button"
            title={isPlaying ? t("pauseTitle") : t("autoSolveTitle")}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
            <span>{isPlaying ? t("pause") : t("autoSolve")}</span>
          </button>

          {/* Next Step */}
          <button
            aria-label={t("nextStep")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.12] bg-[#121824] text-slate-300 shadow-md transition hover:border-white/[0.25] hover:text-white active:translate-y-[2px] active:shadow-inner disabled:opacity-30 shrink-0"
            disabled={step === totalSteps}
            onClick={() => {
              sound.playClick();
              onNext();
            }}
            type="button"
            title={t("nextStep")}
          >
            <SkipForward size={15} />
          </button>

          {/* Last Step */}
          <button
            aria-label={t("lastStep")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.12] bg-[#121824] text-slate-300 shadow-md transition hover:border-white/[0.25] hover:text-white active:translate-y-[2px] active:shadow-inner disabled:opacity-30 shrink-0"
            disabled={step === totalSteps}
            onClick={() => {
              sound.playClick();
              onLast();
            }}
            type="button"
            title={t("lastStep")}
          >
            <FastForward size={15} />
          </button>
        </div>
      </div>

      {/* Bottom Deck: Algorithm Selector, Speed Multiplier & Status Diode */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.08] text-xs">
        {/* Algorithm Segment Selector */}
        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-white/[0.1] bg-[#090d14] p-1 shadow-inner">
          <div className="flex items-center gap-1.5 px-2 text-slate-400 font-mono text-[11px]">
            <Cpu size={14} className="text-amber-400" />
            <span className="hidden sm:inline">{t("algorithmLabel")}</span>
          </div>
          {algorithmsList.map((algo) => (
            <button
              key={algo.id}
              type="button"
              onClick={() => {
                sound.playClick();
                onAlgorithmChange(algo.id);
              }}
              title={algo.desc}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                algorithm === algo.id
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  algorithm === algo.id ? "bg-amber-400 animate-ping" : "bg-slate-600"
                }`}
              />
              <span>{algo.label}</span>
            </button>
          ))}
        </div>

        {/* Speed Multiplier Segment */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
            <Gauge size={14} className="text-emerald-400" />
            <span>{t("speed")}:</span>
          </div>
          <div className="flex items-center rounded-xl border border-white/[0.1] bg-[#090d14] p-1 shadow-inner">
            {SPEED_OPTIONS.map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => {
                  sound.playClick();
                  onSpeedChange(spd);
                }}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold transition ${
                  speed === spd
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 border border-transparent"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Status / Error Notice */}
      {message && (
        <div
          aria-live="polite"
          className={`rounded-xl px-4 py-2.5 text-xs font-medium border shadow-lg transition-all animate-fadeIn ${
            isError
              ? "border-rose-500/40 bg-rose-500/15 text-rose-300"
              : isHint
              ? "border-amber-400/40 bg-amber-400/15 text-amber-200 font-semibold"
              : "border-sky-400/40 bg-sky-400/15 text-sky-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* In-play Status prompt */}
      {!message && selectedRod && (
        <div className="rounded-xl border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-xs text-sky-200 font-medium">
          {t("statusSelected", { rod: selectedRod })}
        </div>
      )}
    </section>
  );
}
