import { useEffect, useState, useCallback } from "react";
import { useHanoiGame } from "./hooks/useHanoiGame";
import { useHanoiSimulation } from "./hooks/useHanoiSimulation";
import { getMinMovesToTarget } from "./algorithms/hanoi";
import { sound } from "./utils/audio";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";

import { Header } from "./components/Header";
import { DiskSelector } from "./components/DiskSelector";
import { HanoiBoard } from "./components/HanoiBoard";
import { Hanoi3DCanvas } from "./components/Hanoi3DCanvas";
import { UnifiedControls } from "./components/UnifiedControls";
import { StatisticsPanel } from "./components/StatisticsPanel";
import { CompletionPanel } from "./components/CompletionPanel";
import { CallStack } from "./components/CallStack";
import { RecursiveVisualizer } from "./components/RecursiveVisualizer";
import { MoveHistory } from "./components/MoveHistory";
import { AlgorithmExplanation } from "./components/AlgorithmExplanation";
import { RulesModal } from "./components/RulesModal";

function VisualizerApp() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [activeSource, setActiveSource] = useState<"manual" | "simulation">("manual");
  const [diskCount, setDiskCount] = useState<number>(4);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const game = useHanoiGame(diskCount);
  const sim = useHanoiSimulation(diskCount);

  const minimumMoves = Math.pow(2, diskCount) - 1;

  // Active state derived from manual game or simulation
  const currentRods = activeSource === "simulation" ? sim.currentRods : game.rods;
  const currentMove = activeSource === "simulation" ? sim.currentStep : game.moveCount;
  const isSolved = activeSource === "simulation" ? sim.isSolved : game.isSolved;

  // Real shortest-path distance to solved state (Peg C)
  // Ensures random moves or moving back and forth never falsely report 100% progress
  const remainingMoves = getMinMovesToTarget(currentRods, diskCount, "C");
  const manualProgress = isSolved
    ? 100
    : remainingMoves >= minimumMoves
    ? 0
    : Math.max(0, Math.min(99, Math.round(((minimumMoves - remainingMoves) / minimumMoves) * 100)));

  const progress = isSolved
    ? 100
    : activeSource === "simulation"
    ? (sim.totalSteps > 0 ? Math.round((sim.currentStep / sim.totalSteps) * 100) : 0)
    : manualProgress;

  const handleReset = useCallback(() => {
    game.resetGame();
    sim.resetSimulation();
    setActiveSource("manual");
  }, [game, sim]);

  const handleToggleSound = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  // Keyboard shortcuts (Space, ArrowLeft, ArrowRight, R, Ctrl+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      if (activeTag === "input" || activeTag === "select" || activeTag === "textarea") {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        setActiveSource("simulation");
        sim.togglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        setActiveSource("simulation");
        sim.goToPrevious();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        setActiveSource("simulation");
        sim.goToNext();
      } else if (e.code === "KeyR") {
        e.preventDefault();
        handleReset();
      } else if (e.code === "KeyZ" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setActiveSource("manual");
        game.undo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sim, game, handleReset]);

  // Compute active step explanation
  const lastManualMove = game.moveHistory[game.moveHistory.length - 1];
  const stepExplanation =
    activeSource === "simulation"
      ? sim.activeMove
        ? t("movedDiskFromTo", {
            disk: sim.activeMove.disk,
            from: sim.activeMove.from,
            to: sim.activeMove.to
          })
        : t("traceDefaultPrompt")
      : game.errorMessage ??
        (lastManualMove
          ? t("movedDiskFromTo", {
              disk: lastManualMove.disk,
              from: lastManualMove.from,
              to: lastManualMove.to
            })
          : t("traceDefaultPrompt"));

  const algorithmName =
    sim.algorithm === "recursive"
      ? t("algoRecursive")
      : sim.algorithm === "iterative"
      ? t("algoIterative")
      : t("algoBinary");

  return (
    <div className="min-h-screen px-4 pb-14 pt-4 sm:px-6 lg:px-8 text-[#f1f5f9]">
      <div className="mx-auto max-w-[1540px] space-y-5">
        {/* Header with Brand, Rules, Audio Toggle & Language Switcher */}
        <Header
          isMuted={isMuted}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
          onToggleSound={handleToggleSound}
          onOpenRules={() => setIsRulesOpen(true)}
          onReset={handleReset}
        />

        {/* Global Controls Bar: Disk Selector & Keyboard hint */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#0d0f15] px-4 py-2.5 shadow-sm">
          <DiskSelector
            value={diskCount}
            onChange={(count) => {
              setDiskCount(count);
              handleReset();
            }}
            disabled={sim.isPlaying}
          />
          <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-slate-400 flex-wrap">
            <span className="text-slate-500">{t("shortcutsLabel")}</span>
            <kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 text-slate-200">Space</kbd>
            <span>{t("shortcutAutoSolve")}</span>
            <kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 text-slate-200">← / →</kbd>
            <span>{t("shortcutStep")}</span>
            <kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 text-slate-200">R</kbd>
            <span>{t("shortcutReset")}</span>
            <kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 text-slate-200">Ctrl+Z</kbd>
            <span>{t("shortcutUndo")}</span>
          </div>
        </div>

        {/* Completion Announcement */}
        {isSolved && (
          <CompletionPanel
            moves={currentMove}
            minimumMoves={minimumMoves}
            onReplay={handleReset}
          />
        )}

        {/* Main Stage Grid: Centerpiece Board + Right Instrument Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Tower Area & Unified Controls */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {viewMode === "3d" ? (
              <Hanoi3DCanvas
                rods={currentRods}
                totalDisks={diskCount}
                selectedRod={activeSource === "manual" ? game.selectedRod : null}
                shakeRod={activeSource === "manual" ? game.shakeRod : null}
                hintMove={activeSource === "manual" ? game.hintMove : null}
                isInteractive={!sim.isPlaying}
                speed={sim.speed}
                onSelectRod={(rod) => {
                  if (sim.isPlaying) return;
                  setActiveSource("manual");
                  game.handleSelectRod(rod);
                }}
              />
            ) : (
              <HanoiBoard
                rods={currentRods}
                totalDisks={diskCount}
                selectedRod={activeSource === "manual" ? game.selectedRod : null}
                shakeRod={activeSource === "manual" ? game.shakeRod : null}
                hintMove={activeSource === "manual" ? game.hintMove : null}
                isInteractive={!sim.isPlaying}
                speed={sim.speed}
                onSelectRod={(rod) => {
                  if (sim.isPlaying) return;
                  setActiveSource("manual");
                  game.handleSelectRod(rod);
                }}
                onDropDisk={(from, to) => {
                  if (sim.isPlaying) return;
                  setActiveSource("manual");
                  game.handleDirectMove(from, to);
                }}
              />
            )}

            {/* Seamless Unified Control Deck */}
            <UnifiedControls
              selectedRod={game.selectedRod}
              message={activeSource === "manual" ? game.errorMessage : null}
              isSolved={isSolved}
              moveCount={game.moveCount}
              onUndo={() => {
                setActiveSource("manual");
                game.undo();
              }}
              onHint={() => {
                setActiveSource("manual");
                game.requestHint();
              }}
              onReset={handleReset}
              algorithm={sim.algorithm}
              step={sim.currentStep}
              totalSteps={sim.totalSteps}
              speed={sim.speed}
              isPlaying={sim.isPlaying}
              onAlgorithmChange={(algo) => {
                setActiveSource("simulation");
                sim.setAlgorithm(algo);
              }}
              onFirst={() => {
                setActiveSource("simulation");
                sim.goToFirst();
              }}
              onPrevious={() => {
                setActiveSource("simulation");
                sim.goToPrevious();
              }}
              onTogglePlay={() => {
                setActiveSource("simulation");
                sim.togglePlay();
              }}
              onNext={() => {
                setActiveSource("simulation");
                sim.goToNext();
              }}
              onLast={() => {
                setActiveSource("simulation");
                sim.goToLast();
              }}
              onSpeedChange={sim.setSpeed}
            />
          </div>

          {/* Right Rail: Statistics & Call Stack */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <StatisticsPanel
              diskCount={diskCount}
              currentMove={currentMove}
              minimumMoves={minimumMoves}
              elapsedSeconds={game.elapsedSeconds}
              progress={progress}
              isSimulating={activeSource === "simulation" && sim.isPlaying}
              algorithmName={algorithmName}
              solved={isSolved}
            />

            <CallStack
              stack={activeSource === "simulation" ? sim.activeStack : []}
              maxDepth={diskCount}
            />
          </div>
        </div>

        {/* Sub-grid: Trace Tree & Move Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7">
            <RecursiveVisualizer
              diskCount={diskCount}
              activeMove={
                activeSource === "simulation"
                  ? sim.activeMove
                  : (game.moveHistory[game.moveHistory.length - 1] ?? null)
              }
              activeStack={activeSource === "simulation" ? sim.activeStack : []}
              stepExplanation={stepExplanation}
              currentStep={currentMove}
              totalSteps={sim.totalSteps}
              onSelectStep={(step) => {
                setActiveSource("simulation");
                sim.goToStep(step);
              }}
            />
          </div>
          <div className="lg:col-span-5">
            <MoveHistory
              moves={activeSource === "simulation" ? sim.allMoves : game.moveHistory}
              currentStep={currentMove}
              onSelectStep={(step) => {
                setActiveSource("simulation");
                sim.goToStep(step);
              }}
              isInteractive={true}
            />
          </div>
        </div>

        {/* Educational Algorithm Deep-Dive */}
        <AlgorithmExplanation currentDisks={diskCount} />
      </div>

      {/* Rules & Guide Illustrated Modal */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <VisualizerApp />
    </LanguageProvider>
  );
}
