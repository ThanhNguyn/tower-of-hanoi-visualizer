import { Check, RotateCcw, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

interface CompletionPanelProps {
  moves: number;
  minimumMoves: number;
  onReplay: () => void;
}

export function CompletionPanel({ moves, minimumMoves, onReplay }: CompletionPanelProps) {
  const { t } = useLanguage();
  const optimal = moves === minimumMoves;
  const extra = moves - minimumMoves;

  const desc = optimal
    ? t("puzzleSolvedDescOptimal", { moves, minMoves: minimumMoves })
    : t("puzzleSolvedDescExtra", { moves, minMoves: minimumMoves, extra });

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      aria-live="polite"
      className="mt-4 overflow-hidden rounded-xl bg-signal-green/10 ring-1 ring-inset ring-signal-green/25"
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-signal-green/15 text-signal-green">
            {optimal ? <Sparkles aria-hidden="true" size={19} /> : <Check aria-hidden="true" size={20} />}
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">{t("puzzleSolvedTitle")}</h2>
            <p className="mt-1 text-sm leading-5 text-slate-300">
              {desc}
            </p>
          </div>
        </div>
        <button className="control-button border-signal-green/35 bg-signal-green/10 text-signal-green hover:bg-signal-green/15 whitespace-nowrap" onClick={onReplay} type="button">
          <RotateCcw aria-hidden="true" size={16} />
          {t("replay")}
        </button>
      </div>
    </motion.section>
  );
}
