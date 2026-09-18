import { Activity, CheckCircle2, Gauge, Layers3, Route, TimerReset } from "lucide-react";

interface StatisticsPanelProps {
  diskCount: number;
  currentMove: number;
  minimumMoves: number;
  recursionDepth: number;
  progress: number;
  mode: "play" | "solve" | "learn";
  solved: boolean;
}

export function StatisticsPanel({
  diskCount,
  currentMove,
  minimumMoves,
  recursionDepth,
  progress,
  mode,
  solved
}: StatisticsPanelProps) {
  const delta = currentMove - minimumMoves;
  const rows = [
    { icon: Layers3, label: "Disks", value: String(diskCount) },
    { icon: Route, label: "Current move", value: `${currentMove} / ${minimumMoves}` },
    { icon: TimerReset, label: "Minimum moves", value: String(minimumMoves) },
    { icon: Gauge, label: "Delta to minimum", value: delta > 0 ? `+${delta}` : String(delta) },
    { icon: Activity, label: "Recursion depth", value: recursionDepth ? String(recursionDepth) : "—" }
  ];

  return (
    <aside aria-label="Live puzzle statistics" className="instrument-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3.5">
        <div>
          <h2 className="text-sm font-semibold text-white">Live state</h2>
          <p className="mt-0.5 text-xs text-slate-500">{mode === "play" ? "Manual run" : "Recursive trace"}</p>
        </div>
        {solved ? (
          <CheckCircle2 aria-label="Puzzle solved" className="text-signal-green" size={19} />
        ) : (
          <span aria-label="Active session" className="status-dot animate-trace-pulse bg-copper-400" />
        )}
      </div>
      <dl className="divide-y divide-white/[0.07] px-4">
        {rows.map(({ icon: Icon, label, value }) => (
          <div className="flex items-center justify-between gap-3 py-3" key={label}>
            <dt className="flex items-center gap-2 text-xs text-slate-400">
              <Icon aria-hidden="true" size={14} strokeWidth={1.8} />
              {label}
            </dt>
            <dd className="data-value text-sm font-medium text-slate-100">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-white/[0.07] px-4 py-3.5">
        <div className="mb-2 flex items-center justify-between">
          <span className="field-label">Progress</span>
          <span className="data-value text-xs text-slate-300">{Math.round(progress)}%</span>
        </div>
        <div aria-label={`Progress ${Math.round(progress)} percent`} className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="h-full rounded-full bg-copper-400 transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
