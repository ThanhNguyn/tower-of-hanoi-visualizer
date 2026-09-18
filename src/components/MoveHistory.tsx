import { useRef, useEffect } from "react";
import { ListOrdered } from "lucide-react";
import type { HanoiMove } from "../types/hanoi";

interface MoveHistoryProps {
  moves: HanoiMove[];
  currentStep: number;
  onSelectStep?: (step: number) => void;
  isInteractive?: boolean;
}

export function MoveHistory({
  moves,
  currentStep,
  onSelectStep,
  isInteractive = true
}: MoveHistoryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeItemRef = useRef<HTMLButtonElement | null>(null);

  // Safely scroll ONLY within the internal container, NEVER scrolling the main window!
  useEffect(() => {
    if (containerRef.current && activeItemRef.current) {
      const container = containerRef.current;
      const item = activeItemRef.current;
      const itemTop = item.offsetTop;
      const itemHeight = item.offsetHeight;
      const containerTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      if (itemTop < containerTop) {
        container.scrollTop = itemTop;
      } else if (itemTop + itemHeight > containerTop + containerHeight) {
        container.scrollTop = itemTop + itemHeight - containerHeight;
      }
    }
  }, [currentStep]);

  return (
    <div className="instrument-panel overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3.5 shrink-0">
        <div className="flex items-center gap-2">
          <ListOrdered className="text-copper-400" size={16} />
          <h2 className="text-sm font-semibold text-white">Move Ledger</h2>
        </div>
        <span className="font-mono text-xs text-slate-400">
          {currentStep} / {moves.length}
        </span>
      </div>

      <div ref={containerRef} className="overflow-y-auto max-h-72 p-2 space-y-1">
        {moves.length === 0 ? (
          <div className="flex h-32 items-center justify-center p-4 text-center font-mono text-xs text-slate-500">
            No moves recorded yet
          </div>
        ) : (
          moves.map((move) => {
            const isActive = currentStep === move.moveIndex;
            const isPast = currentStep > move.moveIndex;

            return (
              <button
                key={move.id}
                ref={isActive ? activeItemRef : null}
                type="button"
                disabled={!isInteractive}
                onClick={() => onSelectStep?.(move.moveIndex)}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-mono transition-all text-left ${
                  isActive
                    ? "bg-copper-400/20 text-copper-200 border border-copper-400/60 shadow-[0_0_10px_rgba(231,173,114,0.15)] ring-1 ring-copper-400/30 font-semibold"
                    : isPast
                    ? "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                    : "text-slate-600 hover:bg-white/[0.02] hover:text-slate-400"
                } ${isInteractive ? "cursor-pointer" : "cursor-default"}`}
                title={`Jump to step ${move.moveIndex}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 w-6">
                    {String(move.moveIndex).padStart(2, "0")}
                  </span>
                  <span className={isActive ? "text-copper-300" : "text-slate-300"}>
                    Disk {move.disk}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-slate-400">
                    {move.from} → {move.to}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="border-t border-white/[0.06] bg-black/20 px-3 py-2 text-[11px] text-slate-500 shrink-0">
        Click any move row to jump the visualizer directly to that step.
      </div>
    </div>
  );
}
