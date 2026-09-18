import { CircleAlert, Clock, Lightbulb, MousePointer2, RotateCcw, Undo2 } from "lucide-react";
import type { Rod } from "../types/hanoi";

interface GameControlsProps {
  selectedRod: Rod | null;
  message: string | null;
  isSolved: boolean;
  elapsedSeconds: number;
  moveCount: number;
  onUndo: () => void;
  onHint: () => void;
  onReset: () => void;
}

export function GameControls({
  selectedRod,
  message,
  isSolved,
  elapsedSeconds,
  moveCount,
  onUndo,
  onHint,
  onReset
}: GameControlsProps) {
  const isError = message?.startsWith("Nước đi không") || message?.startsWith("Invalid");
  const isHint = message?.startsWith("Gợi ý");

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <section aria-labelledby="manual-controls-title" className="border-t border-white/[0.08] px-4 py-3.5 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-sm font-semibold text-white" id="manual-controls-title">
              Bảng điều khiển chơi
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {isSolved
                ? "Đã giải xong! Hãy đặt lại để thử thách số đĩa mới."
                : selectedRod
                ? `Cọc ${selectedRod} đã được chọn. Hãy nhấp vào cọc muốn đặt sang.`
                : "Nhấp để chọn cọc hoặc kéo đĩa trên cùng sang cọc khác."}
            </p>
          </div>

          {/* Stopwatch */}
          <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 font-mono text-xs text-slate-300">
            <Clock size={14} className="text-copper-400" />
            <span>{timeFormatted}</span>
          </div>
        </div>

        {/* Action Buttons: Hint, Undo, Reset */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="control-button border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
            onClick={onHint}
            type="button"
            title="Nhận gợi ý nước đi tối ưu tiếp theo"
          >
            <Lightbulb size={15} />
            Gợi ý
          </button>

          <button
            className="control-button"
            disabled={moveCount === 0 || isSolved}
            onClick={onUndo}
            type="button"
            title="Hoàn tác nước đi gần nhất"
          >
            <Undo2 size={15} />
            Đi lại
          </button>

          <button
            className="control-button control-button-quiet text-slate-300"
            onClick={onReset}
            type="button"
            title="Đặt lại ván chơi"
          >
            <RotateCcw size={15} />
            Đặt lại
          </button>
        </div>
      </div>

      {/* Dynamic Feedback Message Banner */}
      <div
        aria-live="polite"
        className={`mt-3 flex min-h-9 items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
          isError
            ? "bg-signal-red/15 text-signal-red border border-signal-red/30"
            : isHint
            ? "bg-amber-400/15 text-amber-200 border border-amber-400/30 font-semibold"
            : selectedRod
            ? "bg-signal-blue/15 text-signal-blue border border-signal-blue/30"
            : "bg-white/[0.035] text-slate-400 border border-white/[0.06]"
        }`}
      >
        {isError ? (
          <CircleAlert aria-hidden="true" className="shrink-0 text-signal-red" size={16} />
        ) : isHint ? (
          <Lightbulb aria-hidden="true" className="shrink-0 text-amber-400" size={16} />
        ) : (
          <MousePointer2 aria-hidden="true" className="shrink-0 text-slate-400" size={16} />
        )}
        <span>{message ?? "Quy tắc: Mỗi lần chỉ chuyển 1 đĩa trên cùng; đĩa lớn không được đặt trên đĩa nhỏ."}</span>
      </div>
    </section>
  );
}
