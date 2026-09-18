import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateExecutionTrace, solveHanoi } from "../algorithms/hanoi";
import type { AlgorithmType, CallStackFrame, ExecutionStep, HanoiMove, HanoiRods } from "../types/hanoi";
import { sound } from "../utils/audio";

interface UseHanoiSimulationReturn {
  algorithm: AlgorithmType;
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  currentRods: HanoiRods;
  activeMove: HanoiMove | null;
  activeStack: CallStackFrame[];
  activeCallId: string | null;
  stepExplanation: string;
  allMoves: HanoiMove[];
  traceSteps: ExecutionStep[];
  isSolved: boolean;
  setAlgorithm: (algo: AlgorithmType) => void;
  goToFirst: () => void;
  goToPrevious: () => void;
  togglePlay: () => void;
  goToNext: () => void;
  goToLast: () => void;
  goToStep: (step: number) => void;
  resetSimulation: () => void;
  setSpeed: (speed: number) => void;
}

export function useHanoiSimulation(diskCount: number): UseHanoiSimulationReturn {
  const [algorithm, setAlgorithmState] = useState<AlgorithmType>("recursive");
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const allMoves = useMemo(() => solveHanoi(diskCount, algorithm), [diskCount, algorithm]);
  const traceSteps = useMemo(() => generateExecutionTrace(diskCount), [diskCount]);
  const totalSteps = allMoves.length;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Reset when disk count or algorithm changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, [diskCount, algorithm]);

  const setAlgorithm = useCallback((algo: AlgorithmType) => {
    setIsPlaying(false);
    setCurrentStep(0);
    setAlgorithmState(algo);
  }, []);

  const goToFirst = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    sound.playPickup();
  }, []);

  const goToPrevious = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((prev) => {
      const next = Math.max(0, prev - 1);
      sound.playPickup();
      return next;
    });
  }, []);

  const goToNext = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= totalSteps) {
        setIsPlaying(false);
        return prev;
      }
      sound.playDrop();
      const next = prev + 1;
      if (next >= totalSteps) {
        sound.playVictory();
      }
      return next;
    });
  }, [totalSteps]);

  const goToLast = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(totalSteps);
    sound.playVictory();
  }, [totalSteps]);

  const goToStep = useCallback(
    (step: number) => {
      setIsPlaying(false);
      setCurrentStep(Math.max(0, Math.min(totalSteps, step)));
      sound.playDrop();
    },
    [totalSteps]
  );

  const resetSimulation = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    sound.playPickup();
  }, []);

  const togglePlay = useCallback(() => {
    if (currentStep >= totalSteps) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentStep, totalSteps]);

  // Autoplay loop using setTimeout for smooth cadence
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= totalSteps) {
      setIsPlaying(false);
      return;
    }

    // Dynamic interval based on speed: base 700ms
    const intervalMs = Math.max(120, Math.round(700 / speed));

    const timerId = setTimeout(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        sound.playDrop(1 + (next / totalSteps) * 0.4);
        if (next >= totalSteps) {
          setIsPlaying(false);
          sound.playVictory();
        }
        return next;
      });
    }, intervalMs);

    return () => clearTimeout(timerId);
  }, [isPlaying, currentStep, totalSteps, speed]);

  const activeStepData = traceSteps[currentStep] ?? traceSteps[0];
  const activeMove = allMoves[currentStep - 1] ?? null;
  const isSolved = currentStep === totalSteps;

  return {
    algorithm,
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    currentRods: activeStepData.rods,
    activeMove,
    activeStack: activeStepData.stack,
    activeCallId: activeStepData.activeCallId,
    stepExplanation: activeMove ? activeMove.explanation : activeStepData.explanation,
    allMoves,
    traceSteps,
    isSolved,
    setAlgorithm,
    goToFirst,
    goToPrevious,
    togglePlay,
    goToNext,
    goToLast,
    goToStep,
    resetSimulation,
    setSpeed
  };
}
