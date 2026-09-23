import { Layers } from "lucide-react";
import { motion } from "framer-motion";
import type { CallStackFrame } from "../types/hanoi";
import { useLanguage } from "../i18n/LanguageContext";

interface CallStackProps {
  stack: CallStackFrame[];
  maxDepth: number;
}

export function CallStack({ stack, maxDepth }: CallStackProps) {
  const { t } = useLanguage();

  return (
    <div className="instrument-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3.5">
        <div className="flex items-center gap-2">
          <Layers className="text-copper-400" size={16} />
          <h2 className="text-sm font-semibold text-white">{t("callStackTitle")}</h2>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
          <span>{t("depth")}</span>
          <span className="font-semibold text-copper-300">
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
                      ? "border-copper-400/80 bg-copper-400/10 text-copper-200 shadow-[0_0_12px_rgba(231,173,114,0.15)] ring-1 ring-copper-400/40"
                      : "border-white/[0.07] bg-white/[0.02] text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${
                        isTop ? "bg-copper-400 animate-pulse" : "bg-slate-600"
                      }`}
                    />
                    <span className="font-semibold text-slate-200">
                      hanoi({frame.n}, {frame.source}, {frame.auxiliary}, {frame.target})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isTop && (
                      <span className="rounded bg-copper-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-copper-300">
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

      <div className="border-t border-white/[0.06] bg-black/20 px-4 py-2.5 text-[11px] text-slate-400 leading-relaxed">
        <p>{t("callStackExplanation")}</p>
      </div>
    </div>
  );
}
