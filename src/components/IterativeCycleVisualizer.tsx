import { useMemo } from "react";
import { Cpu, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import type { IterativeFrame, Rod } from "../types/hanoi";
import { useLanguage } from "../i18n/LanguageContext";

interface IterativeCycleVisualizerProps {
  diskCount: number;
  currentStep: number;
  totalSteps: number;
  iterativeFrame?: IterativeFrame;
  stepExplanation?: string;
  onSelectStep?: (step: number) => void;
}

export function IterativeCycleVisualizer({
  diskCount,
  currentStep,
  totalSteps,
  iterativeFrame,
  stepExplanation
}: IterativeCycleVisualizerProps) {
  const { t } = useLanguage();

  const isEvenN = diskCount % 2 === 0;
  const cycle = useMemo(
    () => (isEvenN ? (["A", "B", "C"] as Rod[]) : (["A", "C", "B"] as Rod[])),
    [isEvenN]
  );

  const stepType = iterativeFrame?.stepType ?? (currentStep % 2 === 1 ? "odd" : "even");
  const disk1Rod = iterativeFrame?.disk1Rod ?? "A";
  const disk1NextRod = iterativeFrame?.disk1NextRod ?? cycle[(cycle.indexOf(disk1Rod) + 1) % 3];

  return (
    <div className="space-y-4">
      {/* State Machine Header Deck */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c1017] p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu size={16} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">
                {t("iterativeStateMachineTitle")}
              </h2>
              <p className="text-xs text-slate-400">
                {t("iterativePrincipleSubtitle")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-bold tracking-wide border shadow-sm ${
                stepType === "odd"
                  ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-300"
                  : "border-emerald-400/50 bg-emerald-500/15 text-emerald-300"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  stepType === "odd" ? "bg-cyan-400 animate-pulse" : "bg-emerald-400 animate-pulse"
                }`}
              />
              {stepType === "odd" ? t("iterativePhaseOdd") : t("iterativePhaseEven")}
            </span>

            <span className="font-mono text-xs text-slate-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-lg">
              {currentStep} / {totalSteps}
            </span>
          </div>
        </div>

        {/* 3-Peg Cycle Wheel Visual Surface */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Peg Triad Diagram (7 cols) */}
          <div className="md:col-span-7 relative flex items-center justify-center p-6 rounded-xl border border-white/[0.06] bg-[#080c14]/90 overflow-hidden min-h-[220px]">
            {/* Background Radial Glow */}
            <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent pointer-events-none" />

            {/* Triangular Layout of Pegs A, B, C */}
            <div className="relative w-64 h-48 flex items-center justify-center">
              {/* Central Cyclic Arrow Watermark */}
              <div className="absolute flex flex-col items-center justify-center text-slate-600/40">
                <RefreshCw
                  size={56}
                  className={isEvenN ? "animate-spin-slow" : "animate-spin-reverse-slow"}
                />
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 mt-1">
                  {isEvenN ? "A → B → C" : "A → C → B"}
                </span>
              </div>

              {/* Peg Nodes */}
              {(["A", "B", "C"] as Rod[]).map((rod) => {
                const isDisk1Here = disk1Rod === rod;
                const isNextTarget = stepType === "odd" && disk1NextRod === rod;
                const isForcedFrom = iterativeFrame?.forcedMove?.from === rod;
                const isForcedTo = iterativeFrame?.forcedMove?.to === rod;

                // Triangular positions: A (top), B (bottom-left), C (bottom-right)
                let posClasses = "top-0 left-1/2 -translate-x-1/2";
                if (rod === "B") posClasses = "bottom-1 left-2";
                if (rod === "C") posClasses = "bottom-1 right-2";

                return (
                  <div
                    key={rod}
                    className={`absolute ${posClasses} z-10 flex flex-col items-center gap-1.5 transition-all duration-300`}
                  >
                    <div
                      className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 font-mono font-bold text-base shadow-xl transition-all ${
                        isDisk1Here
                          ? "border-cyan-400 bg-cyan-500/25 text-cyan-200 shadow-cyan-500/30 scale-110 ring-2 ring-cyan-400/40"
                          : isNextTarget
                          ? "border-cyan-500/60 bg-cyan-950/60 text-cyan-300 border-dashed animate-pulse"
                          : isForcedFrom
                          ? "border-rose-400/80 bg-rose-500/20 text-rose-200"
                          : isForcedTo
                          ? "border-emerald-400/80 bg-emerald-500/20 text-emerald-200 ring-2 ring-emerald-400/30"
                          : "border-white/[0.12] bg-[#0f1420] text-slate-400"
                      }`}
                    >
                      <span>{t(rod === "A" ? "pegA" : rod === "B" ? "pegB" : "pegC")}</span>

                      {/* Smallest Disk Badge */}
                      {isDisk1Here && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black shadow-md">
                          1
                        </span>
                      )}
                    </div>

                    <span className="font-mono text-[11px] text-slate-400">
                      {isDisk1Here
                        ? t("hasDisk1")
                        : isForcedTo
                        ? t("destinationPeg")
                        : isForcedFrom
                        ? t("sourcePeg")
                        : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Explanation Column (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="rounded-xl border border-white/[0.08] bg-[#080c14] p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <ShieldCheck size={15} className="text-cyan-400" />
                <span>
                  {stepType === "odd" ? t("oddStepRuleTitle") : t("evenStepRuleTitle")}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {stepType === "odd" ? t("oddStepRuleDesc") : t("evenStepRuleDesc")}
              </p>

              {stepType === "odd" && (
                <div className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-mono text-cyan-200">
                  <span className="font-bold">{t("pegLabel", { peg: disk1Rod })}</span>
                  <ArrowRight size={14} className="text-cyan-400" />
                  <span className="font-bold text-cyan-300">{t("pegLabel", { peg: disk1NextRod })}</span>
                  <span className="text-[10px] text-cyan-400 ml-auto font-sans">
                    ({t("smallestDiskOnly")})
                  </span>
                </div>
              )}

              {stepType === "even" && iterativeFrame?.forcedMove && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-mono text-emerald-200">
                  <span>Disk {iterativeFrame.forcedMove.disk}:</span>
                  <span className="font-bold">{t("pegLabel", { peg: iterativeFrame.forcedMove.from })}</span>
                  <ArrowRight size={14} className="text-emerald-400" />
                  <span className="font-bold text-emerald-300">
                    {t("pegLabel", { peg: iterativeFrame.forcedMove.to })}
                  </span>
                  <span className="text-[10px] text-emerald-400 ml-auto font-sans">
                    ({t("onlyLegalChoice")})
                  </span>
                </div>
              )}
            </div>

            {/* Step Explanation Banner */}
            <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3 text-xs text-slate-300 leading-relaxed font-mono">
              <span className="text-slate-500 mr-2">›</span>
              {stepExplanation || t("traceDefaultPrompt")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
