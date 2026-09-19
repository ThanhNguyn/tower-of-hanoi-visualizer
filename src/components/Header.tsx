import { BookOpen, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { HanoiLogo } from "./HanoiLogo";
import { useLanguage } from "../i18n/LanguageContext";

interface HeaderProps {
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenRules: () => void;
  onReset: () => void;
}

export function Header({
  isMuted,
  onToggleSound,
  onOpenRules,
  onReset
}: HeaderProps) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <header className="mb-4 flex flex-col gap-4 border-b border-white/[0.07] pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        <HanoiLogo className="h-10 w-10 shadow-md shrink-0" size={40} />
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            {t("appTitle")}
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {t("appSubtitle")}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Language Switcher Toggle */}
        <div
          className="flex items-center rounded-lg border border-white/[0.1] bg-white/[0.04] p-0.5"
          role="group"
          aria-label={t("language")}
        >
          <button
            type="button"
            onClick={() => setLocale("vi")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              locale === "vi"
                ? "bg-copper-400/25 text-copper-300 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Tiếng Việt"
          >
            <span>🇻🇳</span>
            <span>VI</span>
          </button>
          <button
            type="button"
            onClick={() => setLocale("en")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              locale === "en"
                ? "bg-copper-400/25 text-copper-300 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="English"
          >
            <span>🇬🇧</span>
            <span>EN</span>
          </button>
        </div>

        {/* Rules & Guide Button */}
        <button
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 text-xs font-medium text-slate-200 transition hover:bg-white/[0.08] hover:text-white shrink-0"
          onClick={onOpenRules}
          type="button"
          title={t("rulesAndGuideTitle")}
        >
          <BookOpen size={15} className="text-amber-400/90" />
          <span>{t("rulesAndGuide")}</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] hover:text-white shrink-0"
          onClick={onToggleSound}
          type="button"
          title={isMuted ? t("soundUnmute") : t("soundMute")}
          aria-label={isMuted ? t("soundUnmute") : t("soundMute")}
        >
          {isMuted ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} className="text-emerald-400" />}
        </button>

        {/* Global Reset Button */}
        <button
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white shrink-0"
          onClick={onReset}
          type="button"
          title={t("resetTitle")}
        >
          <RotateCcw size={14} />
          <span>{t("reset")}</span>
        </button>
      </div>
    </header>
  );
}
