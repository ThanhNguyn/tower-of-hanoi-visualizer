import { GitFork } from "lucide-react";
import type { CallStackFrame, HanoiMove } from "../types/hanoi";
import { useLanguage } from "../i18n/LanguageContext";
import { RecursiveBinaryTree } from "./RecursiveBinaryTree";

interface RecursiveVisualizerProps {
  diskCount: number;
  activeMove: HanoiMove | null;
  activeStack: CallStackFrame[];
  stepExplanation: string;
  currentStep?: number;
  totalSteps?: number;
  onSelectStep?: (step: number) => void;
}

export function RecursiveVisualizer({
  diskCount,
  activeMove,
  activeStack,
  stepExplanation,
  currentStep = 0,
  totalSteps = 0,
  onSelectStep
}: RecursiveVisualizerProps) {
  const { t } = useLanguage();
  const currentTopFrame = activeStack.length > 0 ? activeStack[activeStack.length - 1] : null;

  return (
    <div className="space-y-4">
      {/* Execution Context Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0d1017] p-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <GitFork className="text-amber-400" size={16} />
            <h2 className="text-sm font-semibold text-slate-100">{t("traceTreeTitle")}</h2>
          </div>
          <span className="font-mono text-xs text-slate-400">
            {t("disksCount", { count: diskCount })}
          </span>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              {t("currentExecutionFrame")}
            </span>
            {currentTopFrame ? (
              <span className="text-amber-300 font-semibold">
                {t("depthLabel", { depth: currentTopFrame.depth })}
              </span>
            ) : (
              <span className="text-emerald-400 font-medium">✓ Hoàn tất</span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {currentTopFrame ? (
              <code className="rounded bg-amber-400/15 px-2.5 py-1 text-xs font-mono font-semibold text-amber-300 border border-amber-400/30">
                hanoi({currentTopFrame.n}, {currentTopFrame.source}, {currentTopFrame.auxiliary}, {currentTopFrame.target})
              </code>
            ) : (
              <span className="text-xs text-slate-400 italic">Ngăn xếp đã mở rỗng (Stack empty)</span>
            )}
            {activeMove && (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
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
      </div>

      {/* Dynamic Interactive Binary Tree Graph */}
      <RecursiveBinaryTree
        diskCount={diskCount}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onSelectStep={(step) => onSelectStep?.(step)}
      />
    </div>
  );
}
