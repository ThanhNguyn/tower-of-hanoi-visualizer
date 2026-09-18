import { describe, expect, it } from "vitest";
import {
  applyMove,
  generateExecutionTrace,
  generateInitialRods,
  getNextOptimalMove,
  getBoardStateAtStep,
  isPuzzleSolved,
  solveHanoiBinary,
  solveHanoiIterative,
  solveHanoiRecursive,
  validateMove
} from "../src/algorithms/hanoi";

describe("Tower of Hanoi Multi-Algorithm Suite & Game Engine", () => {
  it("Recursive solver generates exact 2^n - 1 moves for n = 3, 4, 5, 6, 7, 8", () => {
    for (let n = 3; n <= 8; n++) {
      const moves = solveHanoiRecursive(n);
      const expectedMoves = Math.pow(2, n) - 1;
      expect(moves.length).toBe(expectedMoves);
    }
  });

  it("Iterative solver generates exact 2^n - 1 legal moves for n = 3, 4, 5", () => {
    for (let n = 3; n <= 5; n++) {
      const moves = solveHanoiIterative(n);
      expect(moves.length).toBe(Math.pow(2, n) - 1);

      let rods = generateInitialRods(n);
      for (const m of moves) {
        const validation = validateMove(rods[m.from], rods[m.to]);
        expect(validation.valid).toBe(true);
        rods = applyMove(rods, m.from, m.to);
      }
      expect(isPuzzleSolved(rods, n, "C")).toBe(true);
    }
  });

  it("Binary Gray-code solver generates exact 2^n - 1 legal moves for n = 3, 4", () => {
    for (let n = 3; n <= 4; n++) {
      const moves = solveHanoiBinary(n);
      expect(moves.length).toBe(Math.pow(2, n) - 1);

      let rods = generateInitialRods(n);
      for (const m of moves) {
        const validation = validateMove(rods[m.from], rods[m.to]);
        expect(validation.valid).toBe(true);
        rods = applyMove(rods, m.from, m.to);
      }
      expect(isPuzzleSolved(rods, n, "C")).toBe(true);
    }
  });

  it("getNextOptimalMove provides valid next move from start and intermediate states", () => {
    const n = 4;
    const initialRods = generateInitialRods(n);

    // From initial state: optimal first move should be moving Disk 1
    const hint = getNextOptimalMove(initialRods, n, "C");
    expect(hint).not.toBeNull();
    expect(hint!.disk).toBe(1);
    expect(hint!.from).toBe("A");

    // When solved, hint should return null
    let solvedRods = generateInitialRods(n);
    const moves = solveHanoiRecursive(n);
    for (const m of moves) {
      solvedRods = applyMove(solvedRods, m.from, m.to);
    }
    expect(getNextOptimalMove(solvedRods, n, "C")).toBeNull();
  });

  it("strictly validates illegal moves properly", () => {
    const emptyValidation = validateMove([], [3, 2, 1]);
    expect(emptyValidation.valid).toBe(false);

    const invalidValidation = validateMove([4], [1]);
    expect(invalidValidation.valid).toBe(false);

    const validValidation = validateMove([1], [4, 3]);
    expect(validValidation.valid).toBe(true);
  });

  it("reconstructs board state at any step accurately", () => {
    const n = 4;
    const moves = solveHanoiRecursive(n);

    const step0 = getBoardStateAtStep(n, moves, 0);
    expect(step0.A.length).toBe(4);
    expect(step0.C.length).toBe(0);

    const stepFinal = getBoardStateAtStep(n, moves, moves.length);
    expect(stepFinal.A.length).toBe(0);
    expect(stepFinal.C.length).toBe(4);
    expect(isPuzzleSolved(stepFinal, n, "C")).toBe(true);
  });

  it("generates correct execution trace and call stack depths", () => {
    const n = 4;
    const trace = generateExecutionTrace(n);
    expect(trace.length).toBe(Math.pow(2, n));

    for (let i = 1; i < trace.length; i++) {
      const step = trace[i];
      expect(step.move).not.toBeNull();
      expect(step.stack.length).toBeGreaterThan(0);
      expect(step.stack.length).toBeLessThanOrEqual(n);
    }
  });
});
