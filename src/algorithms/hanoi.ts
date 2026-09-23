import type {
  AlgorithmType,
  CallStackFrame,
  ExecutionStep,
  HanoiMove,
  HanoiRods,
  Rod,
  TreeNode
} from "../types/hanoi";

export const RODS: Rod[] = ["A", "B", "C"];

/**
 * Creates initial rods: Rod A contains disks from largest to smallest (bottom to top).
 * rod array represents bottom-to-top, so rod[rod.length - 1] is the top disk.
 */
export function generateInitialRods(n: number): HanoiRods {
  const disks: number[] = [];
  for (let i = n; i >= 1; i--) {
    disks.push(i);
  }
  return {
    A: disks,
    B: [],
    C: []
  };
}

/**
 * Deep clones HanoiRods
 */
export function cloneRods(rods: HanoiRods): HanoiRods {
  return {
    A: [...rods.A],
    B: [...rods.B],
    C: [...rods.C]
  };
}

/**
 * Validates if moving top disk from one rod to another is legal.
 */
export function validateMove(
  fromDisks: number[],
  toDisks: number[]
): { valid: boolean; reason?: string } {
  if (fromDisks.length === 0) {
    return { valid: false, reason: "Source rod has no disks to move." };
  }
  const diskToMove = fromDisks[fromDisks.length - 1];
  if (toDisks.length > 0) {
    const topDestDisk = toDisks[toDisks.length - 1];
    if (diskToMove > topDestDisk) {
      return {
        valid: false,
        reason: `Invalid move: Disk ${diskToMove} is larger than Disk ${topDestDisk}. Larger disks cannot be placed on smaller disks.`
      };
    }
  }
  return { valid: true };
}

/**
 * Applies a move from one rod to another immutably.
 */
export function applyMove(rods: HanoiRods, from: Rod, to: Rod): HanoiRods {
  const nextRods = cloneRods(rods);
  const disk = nextRods[from].pop();
  if (disk !== undefined) {
    nextRods[to].push(disk);
  }
  return nextRods;
}

/**
 * Checks if the puzzle is solved on target rod (default: Rod C)
 */
export function isPuzzleSolved(rods: HanoiRods, totalDisks: number, target: Rod = "C"): boolean {
  if (rods[target].length !== totalDisks) return false;
  for (let i = 0; i < totalDisks; i++) {
    if (rods[target][i] !== totalDisks - i) return false;
  }
  return true;
}

/**
 * 1. Canonical Recursive Solver (Divide and Conquer)
 */
export function solveHanoiRecursive(n: number, target: Rod = "C"): HanoiMove[] {
  const moves: HanoiMove[] = [];
  let moveCounter = 0;
  const aux: Rod = (RODS.find((r) => r !== "A" && r !== target) ?? "B") as Rod;

  function hanoi(
    diskCount: number,
    source: Rod,
    auxiliary: Rod,
    dest: Rod,
    callPath: string
  ): void {
    if (diskCount === 1) {
      moveCounter++;
      moves.push({
        id: moveCounter,
        disk: 1,
        from: source,
        to: dest,
        moveIndex: moveCounter,
        callId: `${callPath}-base`,
        explanation: `Base case (n=1): Move Disk 1 directly from ${source} to ${dest}.`
      });
      return;
    }

    hanoi(diskCount - 1, source, dest, auxiliary, `${callPath}.L`);

    moveCounter++;
    moves.push({
      id: moveCounter,
      disk: diskCount,
      from: source,
      to: dest,
      moveIndex: moveCounter,
      callId: `${callPath}-mid`,
      explanation: `Recursive step: Move Disk ${diskCount} from ${source} to ${dest}.`
    });

    hanoi(diskCount - 1, auxiliary, source, dest, `${callPath}.R`);
  }

  hanoi(n, "A", aux, target, "root");
  return moves;
}

/**
 * 2. Iterative Solver (State Machine / Alternating Smallest Disk)
 * Avoids recursion stack completely, O(1) auxiliary space.
 */
export function solveHanoiIterative(n: number, target: Rod = "C"): HanoiMove[] {
  const moves: HanoiMove[] = [];
  const totalMoves = Math.pow(2, n) - 1;
  const rods = generateInitialRods(n);

  const aux: Rod = (RODS.find((r) => r !== "A" && r !== target) ?? "B") as Rod;

  // For even n: Disk 1 cycles A -> aux -> target -> A
  // For odd n:  Disk 1 cycles A -> target -> aux -> A
  const disk1Cycle: Rod[] = n % 2 === 0 ? ["A", aux, target] : ["A", target, aux];

  function getDisk1Next(current: Rod): Rod {
    const idx = disk1Cycle.indexOf(current);
    return disk1Cycle[(idx + 1) % 3];
  }

  function getTop(r: Rod): number | undefined {
    return rods[r].length > 0 ? rods[r][rods[r].length - 1] : undefined;
  }

  let disk1Rod: Rod = "A";

  for (let step = 1; step <= totalMoves; step++) {
    if (step % 2 === 1) {
      // Move Disk 1 along its cycle
      const nextRod = getDisk1Next(disk1Rod);
      rods[disk1Rod].pop();
      rods[nextRod].push(1);

      moves.push({
        id: step,
        disk: 1,
        from: disk1Rod,
        to: nextRod,
        moveIndex: step,
        explanation: `Iterative (Odd step): Cycle smallest Disk 1 from ${disk1Rod} to ${nextRod}.`
      });

      disk1Rod = nextRod;
    } else {
      // Move between the other two rods that do NOT contain disk 1
      const otherRods = RODS.filter((r) => r !== disk1Rod);
      const rod1 = otherRods[0];
      const rod2 = otherRods[1];
      const top1 = getTop(rod1);
      const top2 = getTop(rod2);

      let from: Rod;
      let to: Rod;
      let movingDisk: number;

      if (top1 === undefined) {
        from = rod2;
        to = rod1;
        movingDisk = top2!;
      } else if (top2 === undefined) {
        from = rod1;
        to = rod2;
        movingDisk = top1;
      } else if (top1 < top2) {
        from = rod1;
        to = rod2;
        movingDisk = top1;
      } else {
        from = rod2;
        to = rod1;
        movingDisk = top2;
      }

      rods[from].pop();
      rods[to].push(movingDisk);

      moves.push({
        id: step,
        disk: movingDisk,
        from,
        to,
        moveIndex: step,
        explanation: `Iterative (Even step): Make the only legal move between other rods (${from} → ${to}, Disk ${movingDisk}).`
      });
    }
  }

  return moves;
}

/**
 * 3. Binary / Bitwise Solver (Gray Code)
 * Step k moves disk = ctz(k) + 1 (count trailing zeros).
 */
export function solveHanoiBinary(n: number, target: Rod = "C"): HanoiMove[] {
  const moves: HanoiMove[] = [];
  const totalMoves = Math.pow(2, n) - 1;
  const rods = generateInitialRods(n);

  const aux: Rod = (RODS.find((r) => r !== "A" && r !== target) ?? "B") as Rod;

  const cycleClockwise: Rod[] = ["A", target, aux];
  const cycleCounterClockwise: Rod[] = ["A", aux, target];

  function getCycle(d: number): Rod[] {
    const isOddDisk = d % 2 === 1;
    const isOddN = n % 2 === 1;
    if (isOddN) {
      return isOddDisk ? cycleClockwise : cycleCounterClockwise;
    } else {
      return isOddDisk ? cycleCounterClockwise : cycleClockwise;
    }
  }

  function getNextRodForDisk(d: number, currentRod: Rod): Rod {
    const cycle = getCycle(d);
    const idx = cycle.indexOf(currentRod);
    return cycle[(idx + 1) % 3];
  }

  for (let k = 1; k <= totalMoves; k++) {
    // Disk to move is position of least significant 1-bit: ctz(k) + 1
    const disk = Math.min(n, Math.round(Math.log2(k & -k)) + 1);

    // Find which rod currently holds this disk
    let fromRod: Rod = "A";
    for (const r of RODS) {
      if (rods[r].includes(disk)) {
        fromRod = r;
        break;
      }
    }

    const toRod = getNextRodForDisk(disk, fromRod);

    rods[fromRod].pop();
    rods[toRod].push(disk);

    moves.push({
      id: k,
      disk,
      from: fromRod,
      to: toRod,
      moveIndex: k,
      explanation: `Binary Step ${k} (${k.toString(2)}₂): Least significant 1-bit at index ${disk} → Move Disk ${disk} from ${fromRod} to ${toRod}.`
    });
  }

  return moves;
}

/**
 * Universal dispatcher
 */
export function solveHanoi(n: number, algo: AlgorithmType = "recursive", target: Rod = "C"): HanoiMove[] {
  if (algo === "iterative") {
    return solveHanoiIterative(n, target);
  }
  if (algo === "binary") {
    return solveHanoiBinary(n, target);
  }
  return solveHanoiRecursive(n, target);
}

/**
 * Generates full execution steps with call stack snapshots for step-by-step simulation.
 */
export function generateExecutionTrace(n: number, target: Rod = "C"): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  let currentRods = generateInitialRods(n);
  const aux: Rod = (RODS.find((r) => r !== "A" && r !== target) ?? "B") as Rod;

  steps.push({
    step: 0,
    move: null,
    stack: [
      {
        id: "call-root",
        n,
        source: "A",
        auxiliary: aux,
        target,
        depth: 1,
        stage: "entering"
      }
    ],
    rods: cloneRods(currentRods),
    activeCallId: "call-root",
    explanation: `Initial configuration: ${n} disks on Rod A (Source). Goal: Transfer all to Rod ${target}.`
  });

  const activeStack: CallStackFrame[] = [];
  let moveCounter = 0;

  function runTrace(
    k: number,
    source: Rod,
    auxiliary: Rod,
    dest: Rod,
    path: string,
    depth: number
  ) {
    const frameId = `frame-${path}`;
    const currentFrame: CallStackFrame = {
      id: frameId,
      n: k,
      source,
      auxiliary,
      target: dest,
      depth,
      stage: "entering"
    };

    activeStack.push(currentFrame);

    if (k === 1) {
      moveCounter++;
      currentRods = applyMove(currentRods, source, dest);
      currentFrame.stage = "moving";

      steps.push({
        step: moveCounter,
        move: {
          id: moveCounter,
          disk: 1,
          from: source,
          to: dest,
          moveIndex: moveCounter,
          callId: frameId,
          explanation: `Base case (n=1): Move Disk 1 directly from ${source} to ${dest}.`
        },
        stack: activeStack.map((f) => ({ ...f })),
        rods: cloneRods(currentRods),
        activeCallId: frameId,
        explanation: `Recursion depth ${depth}: Disk 1 placed directly from ${source} onto ${dest}.`
      });

      activeStack.pop();
      return;
    }

    currentFrame.stage = "left-child";
    runTrace(k - 1, source, dest, auxiliary, `${path}-1`, depth + 1);

    moveCounter++;
    currentRods = applyMove(currentRods, source, dest);
    currentFrame.stage = "moving";

    steps.push({
      step: moveCounter,
      move: {
        id: moveCounter,
        disk: k,
        from: source,
        to: dest,
        moveIndex: moveCounter,
        callId: frameId,
        explanation: `Move Disk ${k} from ${source} to ${dest}.`
      },
      stack: activeStack.map((f) => ({ ...f })),
      rods: cloneRods(currentRods),
      activeCallId: frameId,
      explanation: `Recursion depth ${depth}: Transferred top ${k - 1} disks to buffer ${auxiliary}, now moving largest Disk ${k} to ${dest}.`
    });

    currentFrame.stage = "right-child";
    runTrace(k - 1, auxiliary, source, dest, `${path}-2`, depth + 1);

    activeStack.pop();
  }

  runTrace(n, "A", aux, target, "hanoi", 1);

  // Unwind the call stack on completion step
  if (steps.length > 1) {
    const finalStep = steps[steps.length - 1];
    finalStep.stack = [];
    finalStep.explanation = `Completed! Successfully transferred all ${n} disks to Rod ${target}. All recursive calls returned.`;
  }

  return steps;
}

/**
 * Generates full execution steps for the Iterative algorithm with State Machine frames.
 */
export function generateIterativeTrace(n: number, target: Rod = "C"): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const totalMoves = Math.pow(2, n) - 1;
  let currentRods = generateInitialRods(n);
  const aux: Rod = (RODS.find((r) => r !== "A" && r !== target) ?? "B") as Rod;
  const disk1Cycle: Rod[] = n % 2 === 0 ? ["A", aux, target] : ["A", target, aux];

  function getDisk1Next(current: Rod): Rod {
    const idx = disk1Cycle.indexOf(current);
    return disk1Cycle[(idx + 1) % 3];
  }

  function getTop(r: Rod): number | undefined {
    return currentRods[r].length > 0 ? currentRods[r][currentRods[r].length - 1] : undefined;
  }

  let disk1Rod: Rod = "A";

  steps.push({
    step: 0,
    move: null,
    stack: [],
    rods: cloneRods(currentRods),
    activeCallId: null,
    explanation: `Initial state: ${n} disks on Rod A. Iterative cycle direction: ${disk1Cycle.join(" → ")} → ${disk1Cycle[0]}.`,
    iterativeFrame: {
      stepType: "odd",
      disk1Rod: "A",
      disk1NextRod: getDisk1Next("A"),
      disk1Cycle,
      otherRods: [aux, target],
      forcedMove: null
    }
  });

  for (let step = 1; step <= totalMoves; step++) {
    if (step % 2 === 1) {
      const from = disk1Rod;
      const to = getDisk1Next(disk1Rod);
      currentRods = applyMove(currentRods, from, to);
      const otherRods = RODS.filter((r) => r !== to) as [Rod, Rod];

      steps.push({
        step,
        move: {
          id: step,
          disk: 1,
          from,
          to,
          moveIndex: step,
          explanation: `Step ${step} (Odd): Cycle smallest Disk 1 along ${from} → ${to}.`
        },
        stack: [],
        rods: cloneRods(currentRods),
        activeCallId: null,
        explanation: `Odd Step: Smallest Disk 1 moves to next cyclic peg (${from} → ${to}).`,
        iterativeFrame: {
          stepType: "odd",
          disk1Rod: to,
          disk1NextRod: getDisk1Next(to),
          disk1Cycle,
          otherRods,
          forcedMove: null
        }
      });
      disk1Rod = to;
    } else {
      const otherRods = RODS.filter((r) => r !== disk1Rod) as [Rod, Rod];
      const r1 = otherRods[0];
      const r2 = otherRods[1];
      const top1 = getTop(r1);
      const top2 = getTop(r2);

      let from: Rod;
      let to: Rod;
      let movingDisk: number;

      if (top1 === undefined) {
        from = r2;
        to = r1;
        movingDisk = top2!;
      } else if (top2 === undefined) {
        from = r1;
        to = r2;
        movingDisk = top1;
      } else if (top1 < top2) {
        from = r1;
        to = r2;
        movingDisk = top1;
      } else {
        from = r2;
        to = r1;
        movingDisk = top2;
      }

      currentRods = applyMove(currentRods, from, to);

      steps.push({
        step,
        move: {
          id: step,
          disk: movingDisk,
          from,
          to,
          moveIndex: step,
          explanation: `Step ${step} (Even): Only legal move between non-Disk 1 pegs (${from} → ${to}, Disk ${movingDisk}).`
        },
        stack: [],
        rods: cloneRods(currentRods),
        activeCallId: null,
        explanation: `Even Step: Strictly one legal move exists between ${r1} and ${r2}. Moving Disk ${movingDisk} from ${from} to ${to}.`,
        iterativeFrame: {
          stepType: "even",
          disk1Rod,
          disk1NextRod: getDisk1Next(disk1Rod),
          disk1Cycle,
          otherRods,
          forcedMove: { from, to, disk: movingDisk }
        }
      });
    }
  }

  return steps;
}

/**
 * Generates full execution steps for the Binary algorithm with Gray Code register frames.
 */
export function generateBinaryTrace(n: number, target: Rod = "C"): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const totalMoves = Math.pow(2, n) - 1;
  let currentRods = generateInitialRods(n);
  const aux: Rod = (RODS.find((r) => r !== "A" && r !== target) ?? "B") as Rod;

  const cycleClockwise: Rod[] = ["A", target, aux];
  const cycleCounterClockwise: Rod[] = ["A", aux, target];

  function getCycle(d: number): Rod[] {
    const isOddDisk = d % 2 === 1;
    const isOddN = n % 2 === 1;
    if (isOddN) {
      return isOddDisk ? cycleClockwise : cycleCounterClockwise;
    } else {
      return isOddDisk ? cycleCounterClockwise : cycleClockwise;
    }
  }

  function getNextRodForDisk(d: number, currentRod: Rod): Rod {
    const cycle = getCycle(d);
    const idx = cycle.indexOf(currentRod);
    return cycle[(idx + 1) % 3];
  }

  const initialBinary = "0".repeat(n);
  steps.push({
    step: 0,
    move: null,
    stack: [],
    rods: cloneRods(currentRods),
    activeCallId: null,
    explanation: `Initial state: Binary counter k = 0 (${initialBinary}₂). Gray Code G(0) = ${initialBinary}₂.`,
    binaryFrame: {
      stepNumber: 0,
      binaryString: initialBinary,
      trailingZeros: 0,
      activeBitIndex: 0,
      disk: 1,
      grayCode: initialBinary,
      prevGrayCode: initialBinary,
      flippedBitIndex: -1
    }
  });

  for (let k = 1; k <= totalMoves; k++) {
    const trailingZeros = Math.round(Math.log2(k & -k));
    const disk = Math.min(n, trailingZeros + 1);

    let fromRod: Rod = "A";
    for (const r of RODS) {
      if (currentRods[r].includes(disk)) {
        fromRod = r;
        break;
      }
    }

    const toRod = getNextRodForDisk(disk, fromRod);
    currentRods = applyMove(currentRods, fromRod, toRod);

    const binaryString = k.toString(2).padStart(n, "0");
    const grayCode = (k ^ (k >> 1)).toString(2).padStart(n, "0");
    const prevGrayCode = ((k - 1) ^ ((k - 1) >> 1)).toString(2).padStart(n, "0");

    steps.push({
      step: k,
      move: {
        id: k,
        disk,
        from: fromRod,
        to: toRod,
        moveIndex: k,
        explanation: `Binary Step ${k} (${binaryString}₂): Bit ${trailingZeros} is lowest 1-bit → Move Disk ${disk} (${fromRod} → ${toRod}).`
      },
      stack: [],
      rods: cloneRods(currentRods),
      activeCallId: null,
      explanation: `Step ${k} (${binaryString}₂): Trailing zeros = ${trailingZeros} → Move Disk ${disk}. Gray code flip at position ${trailingZeros}.`,
      binaryFrame: {
        stepNumber: k,
        binaryString,
        trailingZeros,
        activeBitIndex: trailingZeros,
        disk,
        grayCode,
        prevGrayCode,
        flippedBitIndex: trailingZeros
      }
    });
  }

  return steps;
}

/**
 * Universal dispatcher for simulation traces.
 */
export function generateTrace(n: number, algo: AlgorithmType = "recursive", target: Rod = "C"): ExecutionStep[] {
  if (algo === "iterative") {
    return generateIterativeTrace(n, target);
  }
  if (algo === "binary") {
    return generateBinaryTrace(n, target);
  }
  return generateExecutionTrace(n, target);
}

/**
 * Solves the remaining puzzle optimally from ANY current board state.
 * Uses getNextOptimalMove iteratively to generate the shortest path to goal.
 */
export function solveFromCurrentState(
  currentRods: HanoiRods,
  totalDisks: number,
  target: Rod = "C",
  startingMoveIndex: number = 0
): HanoiMove[] {
  const moves: HanoiMove[] = [];
  let rods = cloneRods(currentRods);
  let step = startingMoveIndex;
  const maxIterations = 2048;
  let iter = 0;

  while (!isPuzzleSolved(rods, totalDisks, target) && iter < maxIterations) {
    iter++;
    const next = getNextOptimalMove(rods, totalDisks, target);
    if (!next) break;
    step++;
    moves.push({
      id: step,
      disk: next.disk,
      from: next.from,
      to: next.to,
      moveIndex: step,
      explanation: next.reason
    });
    rods = applyMove(rods, next.from, next.to);
  }
  return moves;
}

/**
 * Generates execution steps for a continuation sequence from an arbitrary board state.
 */
export function generateContinuationTrace(
  initialRods: HanoiRods,
  totalDisks: number,
  remainingMoves: HanoiMove[],
  startingStep: number,
  algo: AlgorithmType = "recursive"
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  let currentRods = cloneRods(initialRods);
  const aux: Rod = "B";

  // Step 0 of continuation
  steps.push({
    step: startingStep,
    move: null,
    stack: [
      {
        id: `continuation-root-${startingStep}`,
        n: totalDisks,
        source: "A",
        auxiliary: aux,
        target: "C",
        depth: 1,
        stage: "entering"
      }
    ],
    rods: cloneRods(currentRods),
    activeCallId: `continuation-root-${startingStep}`,
    explanation: `Continuing ${algo} solve from current board state. ${remainingMoves.length} optimal moves remaining.`
  });

  const disk1Cycle: Rod[] = totalDisks % 2 === 0 ? ["A", "B", "C"] : ["A", "C", "B"];
  function getDisk1Next(c: Rod): Rod {
    const idx = disk1Cycle.indexOf(c);
    return disk1Cycle[(idx + 1) % 3];
  }

  for (let i = 0; i < remainingMoves.length; i++) {
    const move = remainingMoves[i];
    const stepNum = startingStep + i + 1;
    currentRods = applyMove(currentRods, move.from, move.to);

    const callFrame: CallStackFrame = {
      id: `frame-cont-${stepNum}`,
      n: move.disk,
      source: move.from,
      auxiliary: (RODS.find((r) => r !== move.from && r !== move.to) ?? "B") as Rod,
      target: move.to,
      depth: Math.min(totalDisks, move.disk),
      stage: "moving"
    };

    const trailingZeros = Math.max(0, move.disk - 1);
    const binaryString = stepNum.toString(2).padStart(totalDisks, "0");
    const grayCode = (stepNum ^ (stepNum >> 1)).toString(2).padStart(totalDisks, "0");
    const prevGrayCode = ((stepNum - 1) ^ ((stepNum - 1) >> 1)).toString(2).padStart(totalDisks, "0");

    const disk1Rod = currentRods.A.includes(1) ? "A" : currentRods.B.includes(1) ? "B" : "C";
    const otherRods = RODS.filter((r) => r !== disk1Rod) as [Rod, Rod];

    steps.push({
      step: stepNum,
      move: { ...move, moveIndex: stepNum, id: stepNum },
      stack: [callFrame],
      rods: cloneRods(currentRods),
      activeCallId: callFrame.id,
      explanation: move.explanation,
      iterativeFrame: {
        stepType: move.disk === 1 ? "odd" : "even",
        disk1Rod,
        disk1NextRod: getDisk1Next(disk1Rod),
        disk1Cycle,
        otherRods,
        forcedMove: move.disk !== 1 ? { from: move.from, to: move.to, disk: move.disk } : null
      },
      binaryFrame: {
        stepNumber: stepNum,
        binaryString,
        trailingZeros,
        activeBitIndex: trailingZeros,
        disk: move.disk,
        grayCode,
        prevGrayCode,
        flippedBitIndex: trailingZeros
      }
    });
  }

  return steps;
}


/**
 * Reconstructs board state at any step index in O(steps) safely.
 */
export function getBoardStateAtStep(
  totalDisks: number,
  moves: HanoiMove[],
  targetStep: number
): HanoiRods {
  let rods = generateInitialRods(totalDisks);
  const boundedStep = Math.max(0, Math.min(moves.length, targetStep));
  for (let i = 0; i < boundedStep; i++) {
    rods = applyMove(rods, moves[i].from, moves[i].to);
  }
  return rods;
}

/**
 * Intelligent Goal-Oriented Solver for Hints:
 * Computes the optimal next move from ANY current board state in O(N) time!
 */
export function getNextOptimalMove(
  rods: HanoiRods,
  totalDisks: number,
  target: Rod = "C"
): { from: Rod; to: Rod; disk: number; reason: string } | null {
  if (isPuzzleSolved(rods, totalDisks, target)) {
    return null;
  }

  function findRodOfDisk(d: number): Rod {
    if (rods.A.includes(d)) return "A";
    if (rods.B.includes(d)) return "B";
    return "C";
  }

  function solveSubgoal(k: number, dest: Rod): { from: Rod; to: Rod; disk: number; reason: string } | null {
    if (k === 0) return null;
    const currentRod = findRodOfDisk(k);
    if (currentRod === dest) {
      return solveSubgoal(k - 1, dest);
    }

    const otherRod = RODS.find((r) => r !== currentRod && r !== dest) as Rod;

    let allOthersOnOther = true;
    for (let i = 1; i < k; i++) {
      if (findRodOfDisk(i) !== otherRod) {
        allOthersOnOther = false;
        break;
      }
    }

    if (allOthersOnOther) {
      return {
        from: currentRod,
        to: dest,
        disk: k,
        reason: `Move Disk ${k} from Rod ${currentRod} to Rod ${dest} towards the goal.`
      };
    }

    return solveSubgoal(k - 1, otherRod);
  }

  return solveSubgoal(totalDisks, target);
}

/**
 * Computes the exact shortest path distance (minimum remaining moves)
 * from ANY current board configuration to the solved goal state (all disks on target).
 * Runs in O(N) time using recursive decomposition on the Sierpiński state graph.
 */
export function getMinMovesToTarget(
  rods: HanoiRods,
  totalDisks: number,
  target: Rod = "C"
): number {
  if (isPuzzleSolved(rods, totalDisks, target)) {
    return 0;
  }

  function findRodOfDisk(d: number): Rod {
    if (rods.A.includes(d)) return "A";
    if (rods.B.includes(d)) return "B";
    return "C";
  }

  function distance(k: number, dest: Rod): number {
    if (k === 0) return 0;
    const currentRod = findRodOfDisk(k);
    if (currentRod === dest) {
      return distance(k - 1, dest);
    }
    const otherRod = RODS.find((r) => r !== currentRod && r !== dest) as Rod;
    // To move disk k from currentRod to dest:
    // 1. Move disks 1..k-1 to otherRod: distance(k - 1, otherRod)
    // 2. Move disk k to dest: 1 move
    // 3. Move disks 1..k-1 from otherRod to dest: (2^(k-1) - 1) moves
    const costToClear = distance(k - 1, otherRod);
    const standardTransfer = Math.pow(2, k - 1) - 1;
    return costToClear + 1 + standardTransfer;
  }

  return distance(totalDisks, target);
}


/**
 * Generates the recursive call tree representation for visual inspection.
 */
export function buildCallTree(n: number): TreeNode {
  let counter = 0;

  function buildNode(k: number, source: Rod, aux: Rod, dest: Rod, depth: number): TreeNode {
    const id = `node-${depth}-${counter++}`;
    if (k === 1) {
      return {
        id,
        n: 1,
        source,
        auxiliary: aux,
        target: dest,
        depth,
        children: []
      };
    }

    const left = buildNode(k - 1, source, dest, aux, depth + 1);
    const right = buildNode(k - 1, aux, source, dest, depth + 1);

    return {
      id,
      n: k,
      source,
      auxiliary: aux,
      target: dest,
      depth,
      children: [left, right]
    };
  }

  return buildNode(n, "A", "B", "C", 1);
}
