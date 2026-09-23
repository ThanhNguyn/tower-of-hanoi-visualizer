import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  generateContinuationTrace,
  generateTrace,
  solveFromCurrentState,
  solveHanoi
} from "../algorithms/hanoi";
import type {
  AlgorithmType,
  BinaryFrame,
  CallStackFrame,
  ExecutionStep,
  HanoiMove,
  HanoiRods,
  IterativeFrame
} from "../types/hanoi";
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
  iterativeFrame?: IterativeFrame;
  binaryFrame?: BinaryFrame;
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
  startContinuation: (
    currentRods: HanoiRods,
    existingMoves: HanoiMove[],
    totalDisks: number,
    algo: AlgorithmType
  ) => void;
}

export function useHanoiSimulation(diskCount: number): UseHanoiSimulationReturn {
  const [algorithm, setAlgorithmState] = useState<AlgorithmType>("recursive");
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Continuation states (when auto-solving from an arbitrary mid-puzzle configuration)
  const [continuationMoves, setContinuationMoves] = useState<HanoiMove[] | null>(null);
  const [continuationTraces, setContinuationTraces] = useState<ExecutionStep[] | null>(null);

  const canonicalMoves = useMemo(() => solveHanoi(diskCount, algorithm), [diskCount, algorithm]);
  const canonicalTraceSteps = useMemo(() => generateTrace(diskCount, algorithm), [diskCount, algorithm]);

  const allMoves = continuationMoves ?? canonicalMoves;
  const traceSteps = continuationTraces ?? canonicalTraceSteps;
  const totalSteps = allMoves.length;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Reset when disk count changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    setContinuationMoves(null);
    setContinuationTraces(null);
  }, [diskCount]);

  const setAlgorithm = useCallback((algo: AlgorithmType) => {
    setIsPlaying(false);
    setCurrentStep(0);
    setContinuationMoves(null);
    setContinuationTraces(null);
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
    setContinuationMoves(null);
    setContinuationTraces(null);
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

  /**
   * Starts or resumes solving from the current arbitrary board state.
   * Keeps existingMoves in the move ledger and appends optimal continuation moves.
   */
  const startContinuation = useCallback(
    (
      currentRods: HanoiRods,
      existingMoves: HanoiMove[],
      totalDisks: number,
      algo: AlgorithmType
    ) => {
      const remainingMoves = solveFromCurrentState(
        currentRods,
        totalDisks,
        "C",
        existingMoves.length
      );

      const combinedMoves = [...existingMoves, ...remainingMoves];
      const continuationSteps = generateContinuationTrace(
        currentRods,
        totalDisks,
        remainingMoves,
        existingMoves.length,
        algo
      );

      setContinuationMoves(combinedMoves);
      setContinuationTraces(continuationSteps);
      setCurrentStep(existingMoves.length);
      setIsPlaying(true);
    },
    []
  );

  // Autoplay loop using setTimeout for cadence, with 8x high speed support
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= totalSteps) {
      setIsPlaying(false);
      return;
    }

    // Dynamic interval based on speed: base 700ms down to 60ms at 8x
    const intervalMs = Math.max(60, Math.round(700 / speed));

    const timerId = setTimeout(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        sound.playDrop(1 + (next / Math.max(1, totalSteps)) * 0.4);
        if (next >= totalSteps) {
          setIsPlaying(false);
          sound.playVictory();
        }
        return next;
      });
    }, intervalMs);

    return () => clearTimeout(timerId);
  }, [isPlaying, currentStep, totalSteps, speed]);

  // Find step data in traces: if in continuation, offset step relative to continuation start
  const activeStepData = useMemo(() => {
    if (!continuationTraces) {
      return traceSteps[currentStep] ?? traceSteps[0];
    }
    const matched = continuationTraces.find((s) => s.step === currentStep);
    return matched ?? continuationTraces[continuationTraces.length - 1] ?? traceSteps[0];
  }, [continuationTraces, traceSteps, currentStep]);

  const activeMove = allMoves[currentStep - 1] ?? null;
  const isSolved = currentStep === totalSteps && totalSteps > 0;

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
    iterativeFrame: activeStepData.iterativeFrame,
    binaryFrame: activeStepData.binaryFrame,
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
    setSpeed,
    startContinuation
  };
}
