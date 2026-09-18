import { describe, expect, it } from "vitest";
import {
  applyMove,
  generateExecutionTrace,
  generateInitialRods,
  getBoardStateAtStep,
  isPuzzleSolved,
  solveHanoi,
  validateMove
} from "../src/algorithms/hanoi";

describe("Tower of Hanoi Recursive Algorithm & Game Engine", () => {
  it("generates exact 2^n - 1 moves for n = 3, 4, 5, 6, 7, 8", () => {
    for (let n = 3; n <= 8; n++) {
      const moves = solveHanoi(n);
      const expectedMoves = Math.pow(2, n) - 1;
      expect(moves.length).toBe(expectedMoves);
    }
  });

  it("strictly adheres to the canonical Hanoi rules for all generated moves", () => {
    const n = 5;
    const moves = solveHanoi(n);
    let rods = generateInitialRods(n);

    for (const move of moves) {
      // Source must have disks
      expect(rods[move.from].length).toBeGreaterThan(0);

      // Moved disk must be the top disk of source
      const topDisk = rods[move.from][rods[move.from].length - 1];
      expect(move.disk).toBe(topDisk);

      // Validation must pass
      const validation = validateMove(rods[move.from], rods[move.to]);
      expect(validation.valid).toBe(true);

      // Apply move
      rods = applyMove(rods, move.from, move.to);
    }

    // Final board state must have all disks on Rod C
    expect(rods.A.length).toBe(0);
    expect(rods.B.length).toBe(0);
    expect(rods.C.length).toBe(n);
    expect(isPuzzleSolved(rods, n, "C")).toBe(true);
  });

  it("validates illegal moves properly", () => {
    // Empty rod
    const emptyValidation = validateMove([], [3, 2, 1]);
    expect(emptyValidation.valid).toBe(false);

    // Larger disk on top of smaller disk
    const invalidValidation = validateMove([4], [1]);
    expect(invalidValidation.valid).toBe(false);
    expect(invalidValidation.reason).toContain("cannot be placed on smaller");

    // Smaller disk on top of larger disk (valid)
    const validValidation = validateMove([1], [4, 3]);
    expect(validValidation.valid).toBe(true);
  });

  it("reconstructs board state at any step accurately", () => {
    const n = 4;
    const moves = solveHanoi(n);

    // Step 0: All disks on A
    const step0 = getBoardStateAtStep(n, moves, 0);
    expect(step0.A.length).toBe(4);
    expect(step0.B.length).toBe(0);
    expect(step0.C.length).toBe(0);

    // Final step: All disks on C
    const stepFinal = getBoardStateAtStep(n, moves, moves.length);
    expect(stepFinal.A.length).toBe(0);
    expect(stepFinal.B.length).toBe(0);
    expect(stepFinal.C.length).toBe(4);
    expect(isPuzzleSolved(stepFinal, n, "C")).toBe(true);
  });

  it("generates correct execution trace and call stack depths", () => {
    const n = 4;
    const trace = generateExecutionTrace(n);
    expect(trace.length).toBe(Math.pow(2, n)); // Step 0 + 2^n - 1 moves

    for (let i = 1; i < trace.length; i++) {
      const step = trace[i];
      expect(step.move).not.toBeNull();
      expect(step.stack.length).toBeGreaterThan(0);
      expect(step.stack.length).toBeLessThanOrEqual(n);
    }
  });
});
