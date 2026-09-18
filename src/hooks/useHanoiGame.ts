import { useCallback, useEffect, useState } from "react";
import { applyMove, generateInitialRods, isPuzzleSolved, validateMove } from "../algorithms/hanoi";
import type { HanoiMove, HanoiRods, Rod } from "../types/hanoi";

interface UseHanoiGameReturn {
  rods: HanoiRods;
  selectedRod: Rod | null;
  moveCount: number;
  moveHistory: HanoiMove[];
  isSolved: boolean;
  errorMessage: string | null;
  shakeRod: Rod | null;
  handleSelectRod: (rod: Rod) => void;
  handleDirectMove: (from: Rod, to: Rod) => boolean;
  resetGame: () => void;
}

export function useHanoiGame(diskCount: number): UseHanoiGameReturn {
  const [rods, setRods] = useState<HanoiRods>(() => generateInitialRods(diskCount));
  const [selectedRod, setSelectedRod] = useState<Rod | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [moveHistory, setMoveHistory] = useState<HanoiMove[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shakeRod, setShakeRod] = useState<Rod | null>(null);

  // Reset when diskCount changes
  useEffect(() => {
    setRods(generateInitialRods(diskCount));
    setSelectedRod(null);
    setMoveCount(0);
    setMoveHistory([]);
    setErrorMessage(null);
    setShakeRod(null);
  }, [diskCount]);

  const resetGame = useCallback(() => {
    setRods(generateInitialRods(diskCount));
    setSelectedRod(null);
    setMoveCount(0);
    setMoveHistory([]);
    setErrorMessage(null);
    setShakeRod(null);
  }, [diskCount]);

  const triggerShake = useCallback((rod: Rod, msg: string) => {
    setErrorMessage(msg);
    setShakeRod(rod);
    const timer = setTimeout(() => {
      setShakeRod(null);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleDirectMove = useCallback(
    (from: Rod, to: Rod): boolean => {
      if (from === to) {
        setSelectedRod(null);
        return false;
      }

      const validation = validateMove(rods[from], rods[to]);
      if (!validation.valid) {
        triggerShake(to, validation.reason ?? "Invalid move.");
        return false;
      }

      const movingDisk = rods[from][rods[from].length - 1];
      const nextRods = applyMove(rods, from, to);
      const nextMoveCount = moveCount + 1;

      const newMove: HanoiMove = {
        id: nextMoveCount,
        disk: movingDisk,
        from,
        to,
        moveIndex: nextMoveCount,
        callId: `manual-${nextMoveCount}`,
        explanation: `Moved Disk ${movingDisk} from Rod ${from} to Rod ${to}.`
      };

      setRods(nextRods);
      setMoveCount(nextMoveCount);
      setMoveHistory((prev) => [...prev, newMove]);
      setSelectedRod(null);
      setErrorMessage(null);
      return true;
    },
    [rods, moveCount, triggerShake]
  );

  const handleSelectRod = useCallback(
    (rod: Rod) => {
      if (selectedRod === null) {
        if (rods[rod].length === 0) {
          triggerShake(rod, `Rod ${rod} has no disks to move.`);
          return;
        }
        setSelectedRod(rod);
        setErrorMessage(null);
      } else if (selectedRod === rod) {
        // Deselect
        setSelectedRod(null);
        setErrorMessage(null);
      } else {
        // Attempt move from selectedRod to rod
        handleDirectMove(selectedRod, rod);
      }
    },
    [selectedRod, rods, triggerShake, handleDirectMove]
  );

  const isSolved = isPuzzleSolved(rods, diskCount, "C");

  return {
    rods,
    selectedRod,
    moveCount,
    moveHistory,
    isSolved,
    errorMessage,
    shakeRod,
    handleSelectRod,
    handleDirectMove,
    resetGame
  };
}
