import { CircleAlert, MousePointer2, RotateCcw } from "lucide-react";
import type { Rod } from "../types/hanoi";

interface GameControlsProps {
  selectedRod: Rod | null;
  message: string | null;
  isSolved: boolean;
  onReset: () => void;
}

export function GameControls({ selectedRod, message, isSolved, onReset }: GameControlsProps) {
  const isError = message?.startsWith("Invalid") ?? false;

  return (
    <section aria-labelledby="manual-controls-title" className="border-t border-white/[0.08] px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white" id="manual-controls-title">
            Manual controls
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {isSolved
              ? "Solved — reset to try another route."
              : selectedRod
                ? `Rod ${selectedRod} selected. Choose a destination rod.`
                : "Select a rod, then select the destination. Dragging a top disk also works."}
          </p>
        </div>
        <button className="control-button self-start sm:self-auto" onClick={onReset} type="button">
          <RotateCcw aria-hidden="true" size={16} />
          Reset puzzle
        </button>
      </div>
      <div
        aria-live="polite"
        className={`mt-3 flex min-h-9 items-center gap-2 rounded-lg px-3 py-2 text-sm ${
          isError
            ? "bg-signal-red/10 text-signal-red"
            : selectedRod
              ? "bg-signal-blue/10 text-signal-blue"
              : "bg-white/[0.035] text-slate-500"
        }`}
      >
        {isError ? <CircleAlert aria-hidden="true" size={16} /> : <MousePointer2 aria-hidden="true" size={16} />}
        <span>{message ?? "Only the top disk can move; a larger disk cannot rest on a smaller disk."}</span>
      </div>
    </section>
  );
}
