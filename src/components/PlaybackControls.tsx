import { FastForward, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

interface PlaybackControlsProps {
  step: number;
  totalSteps: number;
  speed: number;
  isPlaying: boolean;
  onFirst: () => void;
  onPrevious: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onLast: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export function PlaybackControls({
  step,
  totalSteps,
  speed,
  isPlaying,
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
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-white" id="solver-controls-title">
            Solver transport
          </h2>
          <p className="data-value mt-1 text-sm text-slate-400">
            Step <span className="text-slate-100">{step}</span> / {totalSteps}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button aria-label="First step" className="control-button" disabled={step === 0} onClick={onFirst} type="button">
            <FastForward aria-hidden="true" className="rotate-180" size={16} />
          </button>
          <button aria-label="Previous step" className="control-button" disabled={step === 0} onClick={onPrevious} type="button">
            <SkipBack aria-hidden="true" size={16} />
          </button>
          <button
            aria-label={isPlaying ? "Pause playback" : complete ? "Replay solution" : "Play solution"}
            className="control-button control-button-primary min-w-28"
            onClick={onTogglePlay}
            type="button"
          >
            {isPlaying ? <Pause aria-hidden="true" size={16} /> : <Play aria-hidden="true" size={16} />}
            {isPlaying ? "Pause" : complete ? "Replay" : "Play"}
          </button>
          <button aria-label="Next step" className="control-button" disabled={complete} onClick={onNext} type="button">
            <SkipForward aria-hidden="true" size={16} />
          </button>
          <button aria-label="Last step" className="control-button" disabled={complete} onClick={onLast} type="button">
            <FastForward aria-hidden="true" size={16} />
          </button>
          <button aria-label="Reset playback" className="control-button control-button-quiet" onClick={onReset} type="button">
            <RotateCcw aria-hidden="true" size={16} />
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-400" htmlFor="playback-speed">
          <span className="field-label whitespace-nowrap">Speed</span>
          <select
            className="data-value min-h-10 rounded-lg border border-white/[0.1] bg-white/[0.035] px-2.5 text-sm text-slate-100 transition hover:border-white/[0.18]"
            id="playback-speed"
            onChange={(event) => onSpeedChange(Number(event.target.value))}
            value={speed}
          >
            {[0.5, 1, 2, 4].map((value) => (
              <option key={value} value={value}>
                {value}×
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
