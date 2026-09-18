import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateExecutionTrace, solveHanoi } from "../algorithms/hanoi";
import type { CallStackFrame, ExecutionStep, HanoiMove, HanoiRods } from "../types/hanoi";

interface UseHanoiSimulationReturn {
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
  const allMoves = useMemo(() => solveHanoi(diskCount), [diskCount]);
  const traceSteps = useMemo(() => generateExecutionTrace(diskCount), [diskCount]);
  const totalSteps = allMoves.length;

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Reset when disk count changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, [diskCount]);

  const goToFirst = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const goToPrevious = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= totalSteps) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, [totalSteps]);

  const goToLast = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(totalSteps);
  }, [totalSteps]);

  const goToStep = useCallback(
    (step: number) => {
      setIsPlaying(false);
      setCurrentStep(Math.max(0, Math.min(totalSteps, step)));
    },
    [totalSteps]
  );

  const resetSimulation = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const togglePlay = useCallback(() => {
    if (currentStep >= totalSteps) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentStep, totalSteps]);

  // Autoplay loop using setTimeout for precise timing based on speed
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= totalSteps) {
      setIsPlaying(false);
      return;
    }

    // Dynamic interval based on speed: base 800ms
    const intervalMs = Math.max(120, Math.round(800 / speed));

    const timerId = setTimeout(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= totalSteps) {
          setIsPlaying(false);
        }
        return next;
      });
    }, intervalMs);

    return () => clearTimeout(timerId);
  }, [isPlaying, currentStep, totalSteps, speed]);

  const activeStepData = traceSteps[currentStep] ?? traceSteps[0];
  const isSolved = currentStep === totalSteps;

  return {
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    currentRods: activeStepData.rods,
    activeMove: activeStepData.move,
    activeStack: activeStepData.stack,
    activeCallId: activeStepData.activeCallId,
    stepExplanation: activeStepData.explanation,
    allMoves,
    traceSteps,
    isSolved,
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
