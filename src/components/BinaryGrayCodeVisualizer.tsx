import { Sparkles, Binary, Zap } from "lucide-react";
import type { BinaryFrame } from "../types/hanoi";
import { useLanguage } from "../i18n/LanguageContext";

interface BinaryGrayCodeVisualizerProps {
  diskCount: number;
  currentStep: number;
  totalSteps: number;
  binaryFrame?: BinaryFrame;
  stepExplanation?: string;
  onSelectStep?: (step: number) => void;
}

export function BinaryGrayCodeVisualizer({
  diskCount,
  currentStep,
  totalSteps,
  binaryFrame,
  stepExplanation
}: BinaryGrayCodeVisualizerProps) {
  const { t } = useLanguage();

  const binaryStr =
    binaryFrame?.binaryString ?? currentStep.toString(2).padStart(diskCount, "0");
  const grayStr =
    binaryFrame?.grayCode ??
    (currentStep ^ (currentStep >> 1)).toString(2).padStart(diskCount, "0");
  const prevGrayStr =
    binaryFrame?.prevGrayCode ??
    ((Math.max(0, currentStep - 1)) ^ ((Math.max(0, currentStep - 1)) >> 1))
      .toString(2)
      .padStart(diskCount, "0");

  const trailingZeros =
    binaryFrame?.trailingZeros ?? (currentStep > 0 ? Math.round(Math.log2(currentStep & -currentStep)) : 0);
  const activeDisk = binaryFrame?.disk ?? Math.min(diskCount, trailingZeros + 1);

  // Array of bits from MSB (left) to LSB (right)
  const binaryBits = binaryStr.split("");
  const grayBits = grayStr.split("");
  const prevGrayBits = prevGrayStr.split("");

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c1017] p-5 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Binary size={16} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">
                {t("binaryRegisterTitle")}
              </h2>
              <p className="text-xs text-slate-400">
                {t("binaryGrayCodeSubtitle")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/40 bg-teal-500/10 px-3 py-1 text-xs font-mono font-bold text-teal-300">
              <Zap size={12} className="text-teal-400 animate-pulse" />
              {t("binaryStepCounter", { step: currentStep })}
            </span>
            <span className="font-mono text-xs text-slate-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-lg">
              {currentStep} / {totalSteps}
            </span>
          </div>
        </div>

        {/* Binary Register & Bit Inspection Surfaces */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Bit Registers (7 cols) */}
          <div className="md:col-span-7 space-y-4 rounded-xl border border-white/[0.06] bg-[#080c14]/90 p-5">
            {/* Standard Binary Register (k) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
                  {t("binaryRegisterLabel")} <span className="text-slate-500">(k)</span>
                </span>
                <span className="text-cyan-400 font-bold">
                  {currentStep > 0 ? `Least 1-bit: 2^${trailingZeros}` : "k = 0"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {binaryBits.map((bit, idx) => {
                  const bitPower = diskCount - 1 - idx;
                  const isLowestOneBit = currentStep > 0 && bitPower === trailingZeros;

                  return (
                    <div
                      key={`bin-${idx}`}
                      className="flex-1 min-w-[36px] flex flex-col items-center gap-1"
                    >
                      <div
                        className={`w-full aspect-square flex items-center justify-center rounded-xl border-2 font-mono text-base font-bold shadow-lg transition-all ${
                          isLowestOneBit
                            ? "border-cyan-400 bg-cyan-500/30 text-cyan-200 ring-2 ring-cyan-400/50 shadow-cyan-500/30 scale-105"
                            : bit === "1"
                            ? "border-white/[0.2] bg-white/[0.08] text-slate-200"
                            : "border-white/[0.06] bg-black/40 text-slate-600"
                        }`}
                      >
                        {bit}
                      </div>
                      <span className="font-mono text-[9px] text-slate-500">
                        2^{bitPower}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gray Code Register: G(k) = k ^ (k >> 1) */}
            <div className="space-y-2 pt-3 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5">
                  <Sparkles size={13} className="text-teal-400" />
                  <span>{t("grayCodeLabel")}</span>
                  <span className="text-slate-500">G(k) = k ⊕ (k ≫ 1)</span>
                </span>
                <span className="text-teal-400 font-bold">
                  {t("diskToMoveLabel", { disk: activeDisk })}
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {grayBits.map((bit, idx) => {
                  const bitPower = diskCount - 1 - idx;
                  const prevBit = prevGrayBits[idx] ?? "0";
                  const isFlipped = currentStep > 0 && bit !== prevBit;

                  return (
                    <div
                      key={`gray-${idx}`}
                      className="flex-1 min-w-[36px] flex flex-col items-center gap-1"
                    >
                      <div
                        className={`w-full aspect-square flex items-center justify-center rounded-xl border-2 font-mono text-base font-bold shadow-lg transition-all ${
                          isFlipped
                            ? "border-teal-400 bg-teal-500/30 text-teal-200 ring-2 ring-teal-400/50 shadow-teal-500/30 scale-105"
                            : bit === "1"
                            ? "border-white/[0.15] bg-white/[0.05] text-slate-300"
                            : "border-white/[0.06] bg-black/40 text-slate-600"
                        }`}
                      >
                        {bit}
                      </div>
                      <span
                        className={`font-mono text-[9px] ${
                          isFlipped ? "text-teal-400 font-bold" : "text-slate-500"
                        }`}
                      >
                        {isFlipped ? t("flippedBadge") : `b${bitPower}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mathematical Proof Column (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-3">
            <div className="rounded-xl border border-white/[0.08] bg-[#080c14] p-4 space-y-2.5">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-400" />
                <span>{t("bitwiseMechanismTitle")}</span>
              </div>

              <div className="space-y-1.5 font-mono text-xs text-slate-300">
                <div className="flex justify-between border-b border-white/[0.06] pb-1">
                  <span className="text-slate-400">{t("stepNumber")}:</span>
                  <span className="text-white font-bold">{currentStep}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-1">
                  <span className="text-slate-400">Trailing Zeros:</span>
                  <span className="text-cyan-300 font-bold">{trailingZeros}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-1">
                  <span className="text-slate-400">Formula (ctz + 1):</span>
                  <span className="text-teal-300 font-bold">{trailingZeros} + 1 = Disk {activeDisk}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-slate-400">Single Bit Flip:</span>
                  <span className="text-emerald-400 font-bold">Bit Position {trailingZeros}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {t("binaryProofExplanation")}
              </p>
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
