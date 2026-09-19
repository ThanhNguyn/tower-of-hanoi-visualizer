import { GitFork, ArrowDown } from "lucide-react";
import type { CallStackFrame, HanoiMove } from "../types/hanoi";
import { useLanguage } from "../i18n/LanguageContext";

interface RecursiveVisualizerProps {
  diskCount: number;
  activeMove: HanoiMove | null;
  activeStack: CallStackFrame[];
  stepExplanation: string;
}

export function RecursiveVisualizer({
  diskCount,
  activeMove,
  activeStack,
  stepExplanation
}: RecursiveVisualizerProps) {
  const { t } = useLanguage();
  const currentTopFrame = activeStack.length > 0 ? activeStack[activeStack.length - 1] : null;

  return (
    <div className="instrument-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3.5">
        <div className="flex items-center gap-2">
          <GitFork className="text-copper-400" size={16} />
          <h2 className="text-sm font-semibold text-white">{t("traceTreeTitle")}</h2>
        </div>
        <span className="font-mono text-xs text-slate-400">
          {t("disksCount", { count: diskCount })}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Active Recursive Step Banner */}
        <div className="rounded-xl border border-white/[0.08] bg-black/30 p-3.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="field-label text-slate-400">{t("currentExecutionFrame")}</span>
            {currentTopFrame ? (
              <span className="text-copper-300 font-semibold">
                {t("depthLabel", { depth: currentTopFrame.depth })}
              </span>
            ) : (
              <span className="text-slate-500">{t("idle")}</span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {currentTopFrame ? (
              <code className="rounded bg-copper-400/15 px-2.5 py-1 text-xs font-mono font-semibold text-copper-300 border border-copper-400/30">
                hanoi({currentTopFrame.n}, {currentTopFrame.source}, {currentTopFrame.auxiliary}, {currentTopFrame.target})
              </code>
            ) : (
              <span className="text-sm text-slate-400 italic">{t("noActiveFrame")}</span>
            )}
            {activeMove && (
              <span className="text-xs font-mono text-signal-green bg-signal-green/10 border border-signal-green/20 px-2 py-1 rounded">
                {t("moveNumber", {
                  moveIndex: activeMove.moveIndex,
                  disk: activeMove.disk,
                  from: activeMove.from,
                  to: activeMove.to
                })}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed font-sans">
            {stepExplanation || t("traceDefaultPrompt")}
          </p>
        </div>

        {/* Tree Decomposition Visual */}
        <div className="rounded-xl border border-white/[0.08] bg-ink-900/60 p-4">
          <div className="text-xs font-mono field-label mb-3">{t("branchingModelTitle")}</div>
          <div className="flex flex-col items-center space-y-2 text-xs font-mono">
            {/* Root Call */}
            <div className="rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 text-slate-200">
              hanoi({diskCount}, A, B, C)
            </div>

            <ArrowDown className="text-slate-500" size={14} />

            {/* 3 Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full text-center">
              <div
                className={`rounded-lg border p-2 transition-all ${
                  currentTopFrame && currentTopFrame.stage === "left-child"
                    ? "border-signal-blue bg-signal-blue/15 text-signal-blue font-semibold ring-1 ring-signal-blue"
                    : "border-white/[0.08] bg-white/[0.02] text-slate-400"
                }`}
              >
                <div className="text-[10px] text-slate-500 mb-1">{t("step1Left")}</div>
                <div>hanoi({diskCount - 1}, A, C, B)</div>
                <div className="text-[10px] text-slate-500 mt-1">{t("step1LeftDesc")}</div>
              </div>

              <div
                className={`rounded-lg border p-2 transition-all ${
                  currentTopFrame && currentTopFrame.stage === "moving"
                    ? "border-copper-400 bg-copper-400/20 text-copper-300 font-semibold ring-1 ring-copper-400"
                    : "border-white/[0.08] bg-white/[0.02] text-slate-400"
                }`}
              >
                <div className="text-[10px] text-slate-500 mb-1">{t("step2Mid")}</div>
                <div>Move Disk {diskCount} (A → C)</div>
                <div className="text-[10px] text-slate-500 mt-1">{t("step2MidDesc")}</div>
              </div>

              <div
                className={`rounded-lg border p-2 transition-all ${
                  currentTopFrame && currentTopFrame.stage === "right-child"
                    ? "border-signal-blue bg-signal-blue/15 text-signal-blue font-semibold ring-1 ring-signal-blue"
                    : "border-white/[0.08] bg-white/[0.02] text-slate-400"
                }`}
              >
                <div className="text-[10px] text-slate-500 mb-1">{t("step3Right")}</div>
                <div>hanoi({diskCount - 1}, B, A, C)</div>
                <div className="text-[10px] text-slate-500 mt-1">{t("step3RightDesc")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
