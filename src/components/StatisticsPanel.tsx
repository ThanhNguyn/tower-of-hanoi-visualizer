import { CheckCircle2, Clock, Layers3, Route, Sparkles, TimerReset } from "lucide-react";

interface StatisticsPanelProps {
  diskCount: number;
  currentMove: number;
  minimumMoves: number;
  elapsedSeconds?: number;
  progress: number;
  isSimulating: boolean;
  algorithmName?: string;
  solved: boolean;
}

export function StatisticsPanel({
  diskCount,
  currentMove,
  minimumMoves,
  elapsedSeconds = 0,
  progress,
  isSimulating,
  algorithmName,
  solved
}: StatisticsPanelProps) {
  const extraMoves = Math.max(0, currentMove - minimumMoves);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const rows = [
    { icon: Layers3, label: "Total disks", value: String(diskCount) },
    { icon: Route, label: "Moves made", value: `${currentMove} / ${minimumMoves}` },
    { icon: TimerReset, label: "Optimal minimal", value: `${minimumMoves} moves` },
    {
      icon: Sparkles,
      label: "Move efficiency",
      value: extraMoves === 0 ? "Optimal path" : `+${extraMoves} extra moves`
    },
    { icon: Clock, label: "Elapsed timer", value: timeFormatted }
  ];

  return (
    <aside aria-label="Live puzzle telemetry" className="rounded-2xl border border-white/[0.08] bg-[#0d0f15] p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Live State</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            {solved
              ? "Puzzle completed!"
              : isSimulating
              ? `Auto-simulating (${algorithmName || "Recursive"})`
              : "Manual interactive play"}
          </p>
        </div>
        {solved ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 size={16} />
            <span>Solved</span>
          </span>
        ) : isSimulating ? (
          <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        )}
      </div>

      <dl className="divide-y divide-white/[0.06]">
        {rows.map(({ icon: Icon, label, value }) => (
          <div className="flex items-center justify-between gap-3 py-2.5" key={label}>
            <dt className="flex items-center gap-2 text-xs text-slate-400">
              <Icon size={14} className="text-slate-400" />
              {label}
            </dt>
            <dd className="font-mono text-xs font-medium text-slate-100">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 border-t border-white/[0.07] pt-3">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Completion Progress</span>
          <span className="font-mono text-slate-200">{Math.round(progress)}%</span>
        </div>
        <div aria-label={`Progress ${Math.round(progress)} percent`} className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="h-full rounded-full bg-amber-400 transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      </div>
    </aside>
  );
}

