import { useEffect, useState, useCallback } from "react";
import type { AppMode } from "./types/hanoi";
import { useHanoiGame } from "./hooks/useHanoiGame";
import { useHanoiSimulation } from "./hooks/useHanoiSimulation";

import { Header } from "./components/Header";
import { DiskSelector } from "./components/DiskSelector";
import { HanoiBoard } from "./components/HanoiBoard";
import { GameControls } from "./components/GameControls";
import { PlaybackControls } from "./components/PlaybackControls";
import { StatisticsPanel } from "./components/StatisticsPanel";
import { CompletionPanel } from "./components/CompletionPanel";
import { CallStack } from "./components/CallStack";
import { RecursiveVisualizer } from "./components/RecursiveVisualizer";
import { MoveHistory } from "./components/MoveHistory";
import { AlgorithmExplanation } from "./components/AlgorithmExplanation";

export default function App() {
  const [mode, setMode] = useState<AppMode>("play");
  const [diskCount, setDiskCount] = useState<number>(4);

  const game = useHanoiGame(diskCount);
  const sim = useHanoiSimulation(diskCount);

  const minimumMoves = Math.pow(2, diskCount) - 1;

  // Active state derived from current mode
  const currentRods = mode === "play" ? game.rods : sim.currentRods;
  const currentMove = mode === "play" ? game.moveCount : sim.currentStep;
  const isSolved = mode === "play" ? game.isSolved : sim.isSolved;
  const progress = Math.min(100, (currentMove / minimumMoves) * 100);
  const recursionDepth = mode === "play" ? 0 : sim.activeStack.length;

  const handleReset = useCallback(() => {
    if (mode === "play") {
      game.resetGame();
    } else {
      sim.resetSimulation();
    }
  }, [mode, game, sim]);

  // Global keyboard shortcuts (Space, ArrowLeft, ArrowRight, R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is inside an input or select
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      if (activeTag === "input" || activeTag === "select" || activeTag === "textarea") {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        if (mode !== "play") {
          sim.togglePlay();
        }
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        if (mode !== "play") {
          sim.goToPrevious();
        }
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        if (mode !== "play") {
          sim.goToNext();
        }
      } else if (e.code === "KeyR") {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, sim, handleReset]);

  return (
    <div className="app-shell bg-ink-950 text-[#eef2f7]">
      <div className="app-frame space-y-6">
        {/* Header with Brand & Mode Switcher */}
        <Header mode={mode} onModeChange={setMode} onReset={handleReset} />

        {/* Global Controls Bar: Disk Selector & Keyboard hint */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-white/[0.08] bg-ink-900/60 px-4 py-3">
          <DiskSelector
            value={diskCount}
            onChange={(count) => {
              setDiskCount(count);
            }}
            disabled={mode !== "play" && sim.isPlaying}
          />
          <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-slate-500">
            <span>Shortcuts:</span>
            <kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 text-slate-300">Space</kbd>
            <span>Play/Pause</span>
            <kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 text-slate-300">← / →</kbd>
            <span>Step</span>
            <kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 text-slate-300">R</kbd>
            <span>Reset</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Tower Area */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <HanoiBoard
              rods={currentRods}
              totalDisks={diskCount}
              selectedRod={mode === "play" ? game.selectedRod : null}
              shakeRod={mode === "play" ? game.shakeRod : null}
              isInteractive={mode === "play"}
              onSelectRod={(rod) => {
                if (mode === "play") {
                  game.handleSelectRod(rod);
                }
              }}
              onDropDisk={(from, to) => {
                if (mode === "play") {
                  game.handleDirectMove(from, to);
                }
              }}
            />

            {/* Mode-specific Lower Control Strip */}
            <div className="instrument-panel overflow-hidden">
              {mode === "play" ? (
                <GameControls
                  selectedRod={game.selectedRod}
                  message={game.errorMessage}
                  isSolved={game.isSolved}
                  onReset={game.resetGame}
                />
              ) : (
                <PlaybackControls
                  step={sim.currentStep}
                  totalSteps={sim.totalSteps}
                  speed={sim.speed}
                  isPlaying={sim.isPlaying}
                  onFirst={sim.goToFirst}
                  onPrevious={sim.goToPrevious}
                  onTogglePlay={sim.togglePlay}
                  onNext={sim.goToNext}
                  onLast={sim.goToLast}
                  onReset={sim.resetSimulation}
                  onSpeedChange={sim.setSpeed}
                />
              )}
            </div>
          </div>

          {/* Right Rail: Statistics & Call Stack */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <StatisticsPanel
              diskCount={diskCount}
              currentMove={currentMove}
              minimumMoves={minimumMoves}
              recursionDepth={recursionDepth}
              progress={progress}
              mode={mode}
              solved={isSolved}
            />

            <CallStack stack={mode === "play" ? [] : sim.activeStack} maxDepth={diskCount} />
          </div>
        </div>

        {/* Sub-grid: Trace Tree & Move Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <RecursiveVisualizer
              diskCount={diskCount}
              activeMove={mode === "play" ? (game.moveHistory[game.moveHistory.length - 1] ?? null) : sim.activeMove}
              activeStack={mode === "play" ? [] : sim.activeStack}
              stepExplanation={
                mode === "play"
                  ? game.errorMessage ?? (game.moveHistory.length > 0 ? game.moveHistory[game.moveHistory.length - 1].explanation : "Make legal moves from Source to Target.")
                  : sim.stepExplanation
              }
            />
          </div>
          <div className="lg:col-span-5">
            <MoveHistory
              moves={mode === "play" ? game.moveHistory : sim.allMoves}
              currentStep={currentMove}
              onSelectStep={mode === "play" ? undefined : sim.goToStep}
              isInteractive={mode !== "play"}
            />
          </div>
        </div>

        {/* Educational Algorithm Deep-Dive */}
        <AlgorithmExplanation currentDisks={diskCount} />
      </div>
    </div>
  );
}
