import { useCallback, useEffect, useState } from "react";
import {
  applyMove,
  generateInitialRods,
  getNextOptimalMove,
  isPuzzleSolved,
  validateMove
} from "../algorithms/hanoi";
import type { HanoiMove, HanoiRods, Rod } from "../types/hanoi";
import { sound } from "../utils/audio";

interface UseHanoiGameReturn {
  rods: HanoiRods;
  selectedRod: Rod | null;
  moveCount: number;
  moveHistory: HanoiMove[];
  isSolved: boolean;
  errorMessage: string | null;
  shakeRod: Rod | null;
  elapsedSeconds: number;
  hintMove: { from: Rod; to: Rod; disk: number; reason: string } | null;
  handleSelectRod: (rod: Rod) => void;
  handleDirectMove: (from: Rod, to: Rod) => boolean;
  undo: () => void;
  requestHint: () => void;
  resetGame: () => void;
}

export function useHanoiGame(diskCount: number): UseHanoiGameReturn {
  const [rods, setRods] = useState<HanoiRods>(() => generateInitialRods(diskCount));
  const [selectedRod, setSelectedRod] = useState<Rod | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [moveHistory, setMoveHistory] = useState<HanoiMove[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shakeRod, setShakeRod] = useState<Rod | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hintMove, setHintMove] = useState<{ from: Rod; to: Rod; disk: number; reason: string } | null>(null);

  const isSolved = isPuzzleSolved(rods, diskCount, "C");

  // Timer effect: ticks every second when game is active and not solved
  useEffect(() => {
    if (isSolved || moveCount === 0) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSolved, moveCount]);

  // Reset when diskCount changes
  useEffect(() => {
    setRods(generateInitialRods(diskCount));
    setSelectedRod(null);
    setMoveCount(0);
    setMoveHistory([]);
    setErrorMessage(null);
    setShakeRod(null);
    setElapsedSeconds(0);
    setHintMove(null);
  }, [diskCount]);

  const resetGame = useCallback(() => {
    setRods(generateInitialRods(diskCount));
    setSelectedRod(null);
    setMoveCount(0);
    setMoveHistory([]);
    setErrorMessage(null);
    setShakeRod(null);
    setElapsedSeconds(0);
    setHintMove(null);
  }, [diskCount]);

  const triggerShake = useCallback((rod: Rod, msg: string) => {
    sound.playError();
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
        triggerShake(to, validation.reason ?? "Nước đi không hợp lệ.");
        return false;
      }

      const movingDisk = rods[from][rods[from].length - 1];
      const nextRods = applyMove(rods, from, to);
      const nextMoveCount = moveCount + 1;

      sound.playDrop();

      const newMove: HanoiMove = {
        id: nextMoveCount,
        disk: movingDisk,
        from,
        to,
        moveIndex: nextMoveCount,
        explanation: `Chuyển Đĩa ${movingDisk} từ Cọc ${from} sang Cọc ${to}.`
      };

      setRods(nextRods);
      setMoveCount(nextMoveCount);
      setMoveHistory((prev) => [...prev, newMove]);
      setSelectedRod(null);
      setErrorMessage(null);
      setHintMove(null);

      if (isPuzzleSolved(nextRods, diskCount, "C")) {
        sound.playVictory();
      }

      return true;
    },
    [rods, moveCount, diskCount, triggerShake]
  );

  const handleSelectRod = useCallback(
    (rod: Rod) => {
      if (selectedRod === null) {
        if (rods[rod].length === 0) {
          triggerShake(rod, `Cọc ${rod} không có đĩa nào để di chuyển.`);
          return;
        }
        sound.playPickup();
        setSelectedRod(rod);
        setErrorMessage(null);
      } else if (selectedRod === rod) {
        // Deselect
        setSelectedRod(null);
        setErrorMessage(null);
      } else {
        // Move from selectedRod to rod
        handleDirectMove(selectedRod, rod);
      }
    },
    [selectedRod, rods, triggerShake, handleDirectMove]
  );

  const undo = useCallback(() => {
    if (moveHistory.length === 0) return;
    const lastMove = moveHistory[moveHistory.length - 1];

    // Reverse the move: lastMove.to -> lastMove.from
    const nextRods = applyMove(rods, lastMove.to, lastMove.from);
    sound.playPickup();

    setRods(nextRods);
    setMoveCount((prev) => Math.max(0, prev - 1));
    setMoveHistory((prev) => prev.slice(0, -1));
    setSelectedRod(null);
    setErrorMessage(null);
    setHintMove(null);
  }, [moveHistory, rods]);

  const requestHint = useCallback(() => {
    const hint = getNextOptimalMove(rods, diskCount, "C");
    if (hint) {
      sound.playPickup();
      setHintMove(hint);
      setErrorMessage(`Gợi ý: ${hint.reason}`);
    } else {
      setErrorMessage("Câu đố đã được hoàn thành!");
    }
  }, [rods, diskCount]);

  return {
    rods,
    selectedRod,
    moveCount,
    moveHistory,
    isSolved,
    errorMessage,
    shakeRod,
    elapsedSeconds,
    hintMove,
    handleSelectRod,
    handleDirectMove,
    undo,
    requestHint,
    resetGame
  };
}
