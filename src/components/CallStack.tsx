import { Layers, Cpu, Binary } from "lucide-react";
import { motion } from "framer-motion";
import type { AlgorithmType, BinaryFrame, CallStackFrame, IterativeFrame } from "../types/hanoi";
import { useLanguage } from "../i18n/LanguageContext";

interface CallStackProps {
  stack: CallStackFrame[];
  maxDepth: number;
  algorithm?: AlgorithmType;
  iterativeFrame?: IterativeFrame;
  binaryFrame?: BinaryFrame;
  currentStep?: number;
}

export function CallStack({
  stack,
  maxDepth,
  algorithm = "recursive",
  iterativeFrame,
  binaryFrame,
  currentStep = 0
}: CallStackProps) {
  const { t } = useLanguage();

  if (algorithm === "iterative") {
    const isOdd = iterativeFrame?.stepType === "odd" || (currentStep % 2 === 1);
    return (
      <div className="instrument-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Cpu className="text-cyan-400" size={16} />
            <h2 className="text-sm font-semibold text-white">{t("stateMachineInspectorTitle")}</h2>
          </div>
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full border ${
              isOdd
                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {isOdd ? t("iterativePhaseOdd") : t("iterativePhaseEven")}
          </span>
        </div>

        <div className="p-4 space-y-3 font-mono text-xs">
          <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">{t("disk1Position")}:</span>
              <span className="font-bold text-cyan-300">Peg {iterativeFrame?.disk1Rod ?? "A"}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">{t("disk1NextPeg")}:</span>
              <span className="font-bold text-cyan-400">Peg {iterativeFrame?.disk1NextRod ?? "C"}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">{t("cycleOrder")}:</span>
              <span className="text-slate-200">
                {(iterativeFrame?.disk1Cycle ?? ["A", "C", "B"]).join(" → ")}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-cyan-950/20 p-3 text-[11px] text-slate-300 leading-relaxed font-sans">
            {isOdd ? (
              <p>{t("stateMachineOddHelp")}</p>
            ) : (
              <p>{t("stateMachineEvenHelp")}</p>
            )}
          </div>
        </div>

        <div className="border-t border-white/[0.06] bg-black/20 px-4 py-2.5 text-[11px] text-slate-400 leading-relaxed font-sans">
          <p>{t("iterativeInspectorFooter")}</p>
        </div>
      </div>
    );
  }

  if (algorithm === "binary") {
    const trailingZeros = binaryFrame?.trailingZeros ?? (currentStep > 0 ? Math.round(Math.log2(currentStep & -currentStep)) : 0);
    const activeDisk = binaryFrame?.disk ?? (trailingZeros + 1);

    return (
      <div className="instrument-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Binary className="text-teal-400" size={16} />
            <h2 className="text-sm font-semibold text-white">{t("bitwiseInspectorTitle")}</h2>
          </div>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full border border-teal-500/40 bg-teal-500/10 text-teal-300">
            k = {currentStep}
          </span>
        </div>

        <div className="p-4 space-y-3 font-mono text-xs">
          <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Binary (k):</span>
              <span className="font-bold text-cyan-300 tracking-wider">
                {binaryFrame?.binaryString ?? currentStep.toString(2).padStart(maxDepth, "0")}₂
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Gray Code G(k):</span>
              <span className="font-bold text-teal-300 tracking-wider">
                {binaryFrame?.grayCode ?? (currentStep ^ (currentStep >> 1)).toString(2).padStart(maxDepth, "0")}₂
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Trailing Zeros:</span>
              <span className="font-bold text-cyan-400">{trailingZeros}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300 border-t border-white/[0.06] pt-1.5">
              <span className="text-slate-400">{t("movingDisk")}:</span>
              <span className="font-bold text-emerald-300">Disk {activeDisk}</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-teal-950/20 p-3 text-[11px] text-slate-300 leading-relaxed font-sans">
            <p>{t("binaryInspectorHelp")}</p>
          </div>
        </div>

        <div className="border-t border-white/[0.06] bg-black/20 px-4 py-2.5 text-[11px] text-slate-400 leading-relaxed font-sans">
          <p>{t("binaryInspectorFooter")}</p>
        </div>
      </div>
    );
  }

  // Default: Recursive Call Stack
  return (
    <div className="instrument-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3.5">
        <div className="flex items-center gap-2">
          <Layers className="text-cyan-400" size={16} />
          <h2 className="text-sm font-semibold text-white">{t("callStackTitle")}</h2>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
          <span>{t("depth")}</span>
          <span className="font-semibold text-cyan-300">
            {stack.length}
          </span>
          <span className="text-slate-600">/</span>
          <span>{maxDepth}</span>
        </div>
      </div>

      <div className="p-3">
        {stack.length === 0 ? (
          <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-white/[0.08] p-4 text-center">
            <span className="font-mono text-xs text-slate-500">
              {t("stackEmpty")}
            </span>
          </div>
        ) : (
          <div className="flex flex-col-reverse gap-1.5">
            {stack.map((frame, index) => {
              const isTop = index === stack.length - 1;
              return (
                <motion.div
                  key={`${frame.id}-${index}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`relative flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-mono transition-all ${
                    isTop
                      ? "border-cyan-400/80 bg-cyan-400/10 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.15)] ring-1 ring-cyan-400/40"
                      : "border-white/[0.07] bg-white/[0.02] text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${
                        isTop ? "bg-cyan-400 animate-pulse" : "bg-slate-600"
                      }`}
                    />
                    <span className="font-semibold text-slate-200">
                      hanoi({frame.n}, {frame.source}, {frame.auxiliary}, {frame.target})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isTop && (
                      <span className="rounded bg-cyan-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-300">
                        {t("stackTop")}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">d:{frame.depth}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-white/[0.06] bg-black/20 px-4 py-2.5 text-[11px] text-slate-400 leading-relaxed font-sans">
        <p>{t("callStackExplanation")}</p>
      </div>
    </div>
  );
}
