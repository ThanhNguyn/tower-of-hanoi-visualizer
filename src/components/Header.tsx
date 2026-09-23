import { BookOpen, RotateCcw, Volume2, VolumeX, Box, Square } from "lucide-react";
import { HanoiLogo } from "./HanoiLogo";
import { useLanguage } from "../i18n/LanguageContext";
import { sound } from "../utils/audio";

interface HeaderProps {
  isMuted: boolean;
  viewMode: "3d" | "2d";
  onToggleViewMode: (mode: "3d" | "2d") => void;
  onToggleSound: () => void;
  onOpenRules: () => void;
  onReset: () => void;
}

export function Header({
  isMuted,
  viewMode,
  onToggleViewMode,
  onToggleSound,
  onOpenRules,
  onReset
}: HeaderProps) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <header className="mb-4 flex flex-col gap-4 border-b border-white/[0.08] pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        <HanoiLogo className="h-11 w-11 shadow-lg shrink-0" size={44} />
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
        {/* Dual-View Mode Switcher: 3D Studio vs 2D Classic */}
        <div
          className="flex items-center rounded-xl border border-white/[0.12] bg-[#0c111a] p-1 shadow-md"
          role="group"
          aria-label="View Mode Switcher"
        >
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onToggleViewMode("3d");
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              viewMode === "3d"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
            title={t("viewMode3DTitle")}
          >
            <Box size={14} className={viewMode === "3d" ? "text-cyan-400" : "text-slate-500"} />
            <span>{t("viewMode3DLabel")}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onToggleViewMode("2d");
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              viewMode === "2d"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
            title={t("viewMode2DTitle")}
          >
            <Square size={14} className={viewMode === "2d" ? "text-cyan-400" : "text-slate-500"} />
            <span>{t("viewMode2DLabel")}</span>
          </button>
        </div>

        {/* Language Switcher Toggle */}
        <div
          className="flex items-center rounded-xl border border-white/[0.1] bg-[#0c111a] p-1 shadow-md"
          role="group"
          aria-label={t("language")}
        >
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setLocale("vi");
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              locale === "vi"
                ? "bg-white/[0.1] text-cyan-300 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Tiếng Việt"
          >
            <span>🇻🇳</span>
            <span>VI</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setLocale("en");
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              locale === "en"
                ? "bg-white/[0.1] text-cyan-300 shadow-sm"
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
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/[0.1] bg-[#0c111a] px-3 text-xs font-medium text-slate-200 transition hover:bg-white/[0.08] hover:text-white shrink-0"
          onClick={() => {
            sound.playClick();
            onOpenRules();
          }}
          type="button"
          title={t("rulesAndGuideTitle")}
        >
          <BookOpen size={15} className="text-cyan-400/90" />
          <span>{t("rulesAndGuide")}</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-[#0c111a] text-slate-300 transition hover:bg-white/[0.08] hover:text-white shrink-0"
          onClick={onToggleSound}
          type="button"
          title={isMuted ? t("soundUnmute") : t("soundMute")}
          aria-label={isMuted ? t("soundUnmute") : t("soundMute")}
        >
          {isMuted ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} className="text-emerald-400" />}
        </button>

        {/* Global Reset Button */}
        <button
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200 active:scale-95 shrink-0"
          onClick={() => {
            sound.playClick();
            onReset();
          }}
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
