import { useState } from "react";
import { BookOpen, Calculator, Cpu, Sparkles } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface AlgorithmExplanationProps {
  currentDisks: number;
}

export function AlgorithmExplanation({ currentDisks }: AlgorithmExplanationProps) {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<"recursive" | "iterative" | "binary">("recursive");
  const minMoves = Math.pow(2, currentDisks) - 1;

  return (
    <section aria-labelledby="algorithm-heading" className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="text-copper-400" size={20} />
          <h2 id="algorithm-heading" className="section-heading">
            {t("deepDiveTitle")}
          </h2>
        </div>

        {/* Algorithm Strategy Switcher */}
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-white/[0.08] bg-black/40 p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("recursive")}
            className={`px-3 py-1 rounded transition whitespace-nowrap ${
              activeTab === "recursive"
                ? "bg-copper-400/20 text-copper-300 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t("tabRecursive")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("iterative")}
            className={`px-3 py-1 rounded transition whitespace-nowrap ${
              activeTab === "iterative"
                ? "bg-copper-400/20 text-copper-300 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t("tabIterative")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("binary")}
            className={`px-3 py-1 rounded transition whitespace-nowrap ${
              activeTab === "binary"
                ? "bg-copper-400/20 text-copper-300 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t("tabBinary")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Explanation Column */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === "recursive" && (
            <>
              <div className="instrument-panel p-5 space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-signal-blue" />
                  {t("baseCaseTitle")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t("baseCaseDesc")}
                </p>
                <div className="rounded-lg bg-black/40 p-3 font-mono text-xs text-slate-300 border border-white/[0.06]">
                  <span className="text-copper-400">if</span> (n === 1) &#123;<br />
                  &nbsp;&nbsp;moveDisk(source, target);<br />
                  &nbsp;&nbsp;<span className="text-copper-400">return</span>;<br />
                  &#125;
                </div>
              </div>

              <div className="instrument-panel p-5 space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-copper-400" />
                  {t("recursiveCaseTitle")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t("recursiveCaseDesc")}
                </p>
                <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-300 pl-1">
                  <li>
                    <span className="text-slate-200">{t("step1Divide")}</span>
                  </li>
                  <li>
                    <span className="text-slate-200">{t("step2Base")}</span>
                  </li>
                  <li>
                    <span className="text-slate-200">{t("step3Conquer")}</span>
                  </li>
                </ol>
                <div className="rounded-lg bg-black/40 p-3 font-mono text-xs text-slate-300 border border-white/[0.06] overflow-x-auto">
                  hanoi(n - 1, source, target, auxiliary); <span className="text-slate-500">// Step 1</span><br />
                  moveDisk(n, source, target); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">// Step 2</span><br />
                  hanoi(n - 1, auxiliary, source, target); <span className="text-slate-500">// Step 3</span>
                </div>
              </div>
            </>
          )}

          {activeTab === "iterative" && (
            <div className="instrument-panel p-5 space-y-3.5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Cpu className="text-copper-400" size={17} />
                {t("iterativeTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t("iterativeDesc")}
              </p>
              <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4 space-y-2.5 text-xs text-slate-300">
                <div className="font-semibold text-copper-300">{t("iterativePatternTitle")}</div>
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  <li>
                    <strong>{locale === "vi" ? "Lượt lẻ (1, 3, 5, ...):" : "Odd Turns (1, 3, 5, ...):"}</strong> {t("iterativeOddStep")}
                    <br />
                    <span className="font-mono text-copper-300 pl-4">
                      {currentDisks % 2 === 0
                        ? (locale === "vi" ? "A → B → C → A (N chẵn)" : "A → B → C → A (even N)")
                        : (locale === "vi" ? "A → C → B → A (N lẻ)" : "A → C → B → A (odd N)")}
                    </span>
                  </li>
                  <li>
                    <strong>{locale === "vi" ? "Lượt chẵn (2, 4, 6, ...):" : "Even Turns (2, 4, 6, ...):"}</strong> {t("iterativeEvenStep")}
                  </li>
                </ul>
              </div>
              <p className="text-xs text-slate-400">
                {t("iterativeConclusion")}
              </p>
            </div>
          )}

          {activeTab === "binary" && (
            <div className="instrument-panel p-5 space-y-3.5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="text-signal-green" size={17} />
                {t("binaryTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t("binaryDesc")}
              </p>
              <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4 space-y-2 text-xs text-slate-300 font-mono">
                <div>Step 1 = 001₂ → Trailing zeros = 0 → {locale === "vi" ? "Chuyển Đĩa 1" : "Move Disk 1"}</div>
                <div>Step 2 = 010₂ → Trailing zeros = 1 → {locale === "vi" ? "Chuyển Đĩa 2" : "Move Disk 2"}</div>
                <div>Step 3 = 011₂ → Trailing zeros = 0 → {locale === "vi" ? "Chuyển Đĩa 1" : "Move Disk 1"}</div>
                <div>Step 4 = 100₂ → Trailing zeros = 2 → {locale === "vi" ? "Chuyển Đĩa 3" : "Move Disk 3"}</div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t("binaryExplanation")}
              </p>
            </div>
          )}
        </div>

        {/* Math & Complexity Column */}
        <div className="space-y-4">
          <div className="instrument-panel p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Calculator className="text-copper-400" size={16} />
              {t("mathRecurrenceTitle")}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t("mathRecurrenceIntro")}
            </p>
            <div className="rounded-lg bg-black/40 p-3 font-mono text-xs text-center border border-white/[0.06] text-copper-300 space-y-1">
              <div>T(1) = 1</div>
              <div>T(n) = 2 · T(n - 1) + 1</div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{t("mathUnrolling")}</p>
            <div className="text-xs font-mono text-slate-300 pl-2 border-l border-white/[0.1] space-y-0.5">
              <div>T(n) = 2(2T(n-2) + 1) + 1</div>
              <div>T(n) = 2ⁿ⁻¹ + ... + 2¹ + 2⁰</div>
              <div className="text-signal-green font-bold pt-1 text-sm">T(n) = 2ⁿ - 1</div>
            </div>
          </div>

          <div className="instrument-panel p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="text-signal-green" size={16} />
              {t("complexityTitle")}
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-400">{t("timeComplexity")}</span>
                <span className="text-signal-green font-semibold">O(2ⁿ)</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-400">{t("recursiveSpace")}</span>
                <span className="text-copper-300 font-semibold">O(n)</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-400">{t("iterativeSpace")}</span>
                <span className="text-signal-blue font-semibold">O(1)</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-slate-300">{t("movesForNDisks", { count: currentDisks })}</span>
                <span className="text-white font-bold">{minMoves} {locale === "vi" ? "bước" : "moves"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
