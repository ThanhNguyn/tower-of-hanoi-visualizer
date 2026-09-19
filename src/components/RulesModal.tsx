import { useState } from "react";
import { BookOpen, CheckCircle, Lightbulb, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"rules" | "algorithms" | "legend">("rules");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white/[0.12] bg-[#0f1722] shadow-2xl overflow-hidden z-10"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 bg-ink-900/80">
            <div className="flex items-center gap-2.5">
              <BookOpen className="text-copper-400" size={20} />
              <h2 className="text-base font-semibold text-white">
                {t("modalTitle")}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-white/[0.06] hover:text-white transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-white/[0.06] px-5 bg-black/20 text-xs font-medium overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("rules")}
              className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
                activeTab === "rules"
                  ? "border-copper-400 text-copper-300 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {t("tabGameRules")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("algorithms")}
              className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
                activeTab === "algorithms"
                  ? "border-copper-400 text-copper-300 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {t("tabSolvingParadigms")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("legend")}
              className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
                activeTab === "legend"
                  ? "border-copper-400 text-copper-300 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {t("tabLegend")}
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-5 space-y-4 text-sm text-slate-300">
            {activeTab === "rules" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-copper-400/20 bg-copper-400/10 p-4">
                  <h3 className="font-semibold text-copper-200 flex items-center gap-2 mb-1">
                    <Lightbulb size={16} /> {t("objectiveTitle")}
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {t("objectiveDesc")}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    {t("canonicalRulesTitle")}
                  </h4>

                  <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                    <CheckCircle className="text-signal-green shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong className="text-white block mb-0.5">{t("rule1Title")}</strong>
                      <p className="text-xs text-slate-400">
                        {t("rule1Desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                    <CheckCircle className="text-signal-green shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong className="text-white block mb-0.5">{t("rule2Title")}</strong>
                      <p className="text-xs text-slate-400">
                        {t("rule2Desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                    <CheckCircle className="text-signal-green shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong className="text-white block mb-0.5">{t("rule3Title")}</strong>
                      <p className="text-xs text-slate-400">
                        {t("rule3Desc")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-black/30 p-3.5 text-xs text-slate-400">
                  <span className="font-mono text-copper-300 font-semibold">{t("minimalOptimalMovesLabel")}</span>{" "}
                  {t("minimalOptimalMovesDesc", { formula: "2ⁿ - 1" })}
                </div>
              </div>
            )}

            {activeTab === "algorithms" && (
              <div className="space-y-3.5">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-2">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-signal-blue" />
                    {t("paradigmRecursiveTitle")}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("paradigmRecursiveDesc")}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-2">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-copper-400" />
                    {t("paradigmIterativeTitle")}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("paradigmIterativeDesc")}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-2">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-signal-green" />
                    {t("paradigmBinaryTitle")}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("paradigmBinaryDesc")}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "legend" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
                  <h4 className="font-semibold text-copper-300 flex items-center gap-2">
                    <Sparkles size={16} /> {t("legendTitle")}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("legendP1")}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("legendP2")}
                  </p>
                  <div className="rounded-lg bg-black/40 p-3 font-mono text-xs text-signal-green border border-white/[0.08] space-y-1">
                    <div>{t("legendTotalMoves")}</div>
                    <div>{t("legendTimeRequired")}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="border-t border-white/[0.08] px-5 py-3 bg-ink-900/60 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="control-button control-button-primary px-5 py-1.5 text-xs"
            >
              {t("modalCloseButton")}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
