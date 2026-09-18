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
  { id: "recursive", label: "Đệ quy", desc: "Chia để trị kinh điển O(2ⁿ), ngăn xếp O(N)" },
  { id: "iterative", label: "Vòng lặp", desc: "Bán chu kỳ / Modulo luân phiên, bộ nhớ O(1)" },
  { id: "binary", label: "Nhị phân", desc: "Mã Gray & đếm vị trí bit 1 tận cùng" }
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
              Điều khiển mô phỏng
            </h2>
            <p className="data-value mt-0.5 text-xs text-slate-400">
              Bước <span className="text-white font-semibold">{step}</span> / {totalSteps}
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
            aria-label="Về bước đầu tiên"
            className="control-button"
            disabled={step === 0}
            onClick={onFirst}
            type="button"
            title="Về bước đầu tiên"
          >
            <FastForward aria-hidden="true" className="rotate-180" size={15} />
          </button>
          <button
            aria-label="Bước trước đó"
            className="control-button"
            disabled={step === 0}
            onClick={onPrevious}
            type="button"
            title="Lùi 1 bước"
          >
            <SkipBack aria-hidden="true" size={15} />
          </button>
          <button
            aria-label={isPlaying ? "Tạm dừng" : complete ? "Chạy lại từ đầu" : "Bắt đầu chạy"}
            className="control-button control-button-primary min-w-28 font-semibold"
            onClick={onTogglePlay}
            type="button"
          >
            {isPlaying ? <Pause aria-hidden="true" size={16} /> : <Play aria-hidden="true" size={16} />}
            {isPlaying ? "Tạm dừng" : complete ? "Chạy lại" : "Tự động chạy"}
          </button>
          <button
            aria-label="Bước tiếp theo"
            className="control-button"
            disabled={complete}
            onClick={onNext}
            type="button"
            title="Tiến 1 bước"
          >
            <SkipForward aria-hidden="true" size={15} />
          </button>
          <button
            aria-label="Nhảy tới bước cuối cùng"
            className="control-button"
            disabled={complete}
            onClick={onLast}
            type="button"
            title="Đến bước giải xong"
          >
            <FastForward aria-hidden="true" size={15} />
          </button>
          <button
            aria-label="Đặt lại mô phỏng"
            className="control-button control-button-quiet"
            onClick={onReset}
            type="button"
            title="Đặt lại về bước 0"
          >
            <RotateCcw aria-hidden="true" size={15} />
          </button>
        </div>

        {/* Right: Playback Speed */}
        <label className="flex items-center gap-2 text-xs text-slate-400 self-end lg:self-auto" htmlFor="playback-speed">
          <span className="field-label whitespace-nowrap">Tốc độ</span>
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
