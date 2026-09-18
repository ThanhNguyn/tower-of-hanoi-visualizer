import { Cpu, FastForward, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { AlgorithmType } from "../types/hanoi";

interface PlaybackControlsProps {
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
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

const ALGORITHMS: Array<{ id: AlgorithmType; label: string; desc: string }> = [
  { id: "recursive", label: "Recursive", desc: "Canonical divide-and-conquer O(2ⁿ), O(N) call stack" },
  { id: "iterative", label: "Iterative", desc: "Alternating smallest disk strategy, O(1) auxiliary space" },
  { id: "binary", label: "Binary", desc: "Gray code & trailing zeros bitwise counter" }
];

export function PlaybackControls({
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
  onReset,
  onSpeedChange
}: PlaybackControlsProps) {
  const complete = step === totalSteps;

  return (
    <section aria-labelledby="solver-controls-title" className="border-t border-white/[0.08] px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Step indicator & Algorithm Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h2 className="text-sm font-semibold text-white" id="solver-controls-title">
              Solver transport
            </h2>
            <p className="data-value mt-0.5 text-xs text-slate-400">
              Step <span className="text-white font-semibold">{step}</span> / {totalSteps}
            </p>
          </div>

          {/* Algorithm Tabs */}
          <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-black/30 p-1">
            <Cpu size={14} className="text-copper-400 ml-1.5 mr-0.5 hidden sm:block" />
            {ALGORITHMS.map((algo) => (
              <button
                key={algo.id}
                type="button"
                onClick={() => onAlgorithmChange(algo.id)}
                title={algo.desc}
                className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                  algorithm === algo.id
                    ? "bg-copper-400/20 text-copper-300 font-semibold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {algo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Transport buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            aria-label="Jump to first step"
            className="control-button"
            disabled={step === 0}
            onClick={onFirst}
            type="button"
            title="First step"
          >
            <FastForward aria-hidden="true" className="rotate-180" size={15} />
          </button>
          <button
            aria-label="Previous step"
            className="control-button"
            disabled={step === 0}
            onClick={onPrevious}
            type="button"
            title="Previous step"
          >
            <SkipBack aria-hidden="true" size={15} />
          </button>
          <button
            aria-label={isPlaying ? "Pause simulation" : complete ? "Replay solution" : "Play simulation"}
            className="control-button control-button-primary min-w-28 font-semibold"
            onClick={onTogglePlay}
            type="button"
          >
            {isPlaying ? <Pause aria-hidden="true" size={16} /> : <Play aria-hidden="true" size={16} />}
            {isPlaying ? "Pause" : complete ? "Replay" : "Play"}
          </button>
          <button
            aria-label="Next step"
            className="control-button"
            disabled={complete}
            onClick={onNext}
            type="button"
            title="Next step"
          >
            <SkipForward aria-hidden="true" size={15} />
          </button>
          <button
            aria-label="Jump to last step"
            className="control-button"
            disabled={complete}
            onClick={onLast}
            type="button"
            title="Last step"
          >
            <FastForward aria-hidden="true" size={15} />
          </button>
          <button
            aria-label="Reset simulation"
            className="control-button control-button-quiet"
            onClick={onReset}
            type="button"
            title="Reset step to 0"
          >
            <RotateCcw aria-hidden="true" size={15} />
          </button>
        </div>

        {/* Right: Playback Speed */}
        <label className="flex items-center gap-2 text-xs text-slate-400 self-end lg:self-auto" htmlFor="playback-speed">
          <span className="field-label whitespace-nowrap">Speed</span>
          <select
            className="data-value min-h-9 rounded-lg border border-white/[0.1] bg-white/[0.04] px-2.5 text-xs text-slate-100 transition hover:border-white/[0.18]"
            id="playback-speed"
            onChange={(event) => onSpeedChange(Number(event.target.value))}
            value={speed}
          >
            {[0.5, 1, 2, 4].map((val) => (
              <option key={val} value={val} className="bg-ink-900 text-white">
                {val}×
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
