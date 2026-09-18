import type { CallStackFrame, ExecutionStep, HanoiMove, HanoiRods, Rod, TreeNode } from "../types/hanoi";

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
    return { valid: false, reason: "Source rod has no disks." };
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
 * Canonical recursive solver that generates typed moves.
 */
export function solveHanoi(n: number): HanoiMove[] {
  const moves: HanoiMove[] = [];
  let moveCounter = 0;

  function hanoi(
    diskCount: number,
    source: Rod,
    auxiliary: Rod,
    target: Rod,
    callPath: string
  ): void {
    if (diskCount === 1) {
      moveCounter++;
      moves.push({
        id: moveCounter,
        disk: 1,
        from: source,
        to: target,
        moveIndex: moveCounter,
        callId: `${callPath}-base`,
        explanation: `Base case: Move Disk 1 directly from ${source} to ${target}.`
      });
      return;
    }

    // Step 1: Move n - 1 disks from source to auxiliary using target as buffer
    hanoi(diskCount - 1, source, target, auxiliary, `${callPath}.L`);

    // Step 2: Move the largest disk n from source to target
    moveCounter++;
    moves.push({
      id: moveCounter,
      disk: diskCount,
      from: source,
      to: target,
      moveIndex: moveCounter,
      callId: `${callPath}-mid`,
      explanation: `Recursive step: Move Disk ${diskCount} from ${source} to ${target}.`
    });

    // Step 3: Move n - 1 disks from auxiliary to target using source as buffer
    hanoi(diskCount - 1, auxiliary, source, target, `${callPath}.R`);
  }

  hanoi(n, "A", "B", "C", "root");
  return moves;
}

/**
 * Generates full execution steps with call stack snapshots for step-by-step simulation.
 */
export function generateExecutionTrace(n: number): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  let currentRods = generateInitialRods(n);

  // Step 0: Initial state before any move
  steps.push({
    step: 0,
    move: null,
    stack: [
      {
        id: "call-root",
        n,
        source: "A",
        auxiliary: "B",
        target: "C",
        depth: 1,
        stage: "entering"
      }
    ],
    rods: cloneRods(currentRods),
    activeCallId: "call-root",
    explanation: `Initial state with ${n} disks on Rod A (Source). Goal: Transfer all to Rod C (Target).`
  });

  const activeStack: CallStackFrame[] = [];
  let moveCounter = 0;

  function runTrace(
    k: number,
    source: Rod,
    auxiliary: Rod,
    target: Rod,
    path: string,
    depth: number
  ) {
    const frameId = `frame-${path}`;
    const currentFrame: CallStackFrame = {
      id: frameId,
      n: k,
      source,
      auxiliary,
      target,
      depth,
      stage: "entering"
    };

    activeStack.push(currentFrame);

    if (k === 1) {
      // Base case move
      moveCounter++;
      currentRods = applyMove(currentRods, source, target);
      currentFrame.stage = "moving";

      steps.push({
        step: moveCounter,
        move: {
          id: moveCounter,
          disk: 1,
          from: source,
          to: target,
          moveIndex: moveCounter,
          callId: frameId,
          explanation: `Base case (n=1): Move Disk 1 from ${source} to ${target}.`
        },
        stack: activeStack.map((f) => ({ ...f })),
        rods: cloneRods(currentRods),
        activeCallId: frameId,
        explanation: `Base case reached at depth ${depth}: Moving Disk 1 directly from ${source} to ${target}.`
      });

      activeStack.pop();
      return;
    }

    // Step 1: Sub-problem 1
    currentFrame.stage = "left-child";
    runTrace(k - 1, source, target, auxiliary, `${path}-1`, depth + 1);

    // Step 2: Move disk k
    moveCounter++;
    currentRods = applyMove(currentRods, source, target);
    currentFrame.stage = "moving";

    steps.push({
      step: moveCounter,
      move: {
        id: moveCounter,
        disk: k,
        from: source,
        to: target,
        moveIndex: moveCounter,
        callId: frameId,
        explanation: `Move Disk ${k} from ${source} to ${target}.`
      },
      stack: activeStack.map((f) => ({ ...f })),
      rods: cloneRods(currentRods),
      activeCallId: frameId,
      explanation: `Recursive case at depth ${depth}: Transferred top ${k - 1} disks to ${auxiliary}; now moving Disk ${k} to ${target}.`
    });

    // Step 3: Sub-problem 2
    currentFrame.stage = "right-child";
    runTrace(k - 1, auxiliary, source, target, `${path}-2`, depth + 1);

    activeStack.pop();
  }

  runTrace(n, "A", "B", "C", "hanoi", 1);
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
 * Generates the recursive call tree representation for visual inspection.
 */
export function buildCallTree(n: number): TreeNode {
  let counter = 0;

  function buildNode(k: number, source: Rod, aux: Rod, target: Rod, depth: number): TreeNode {
    const id = `node-${depth}-${counter++}`;
    if (k === 1) {
      return {
        id,
        n: 1,
        source,
        auxiliary: aux,
        target,
        depth,
        children: []
      };
    }

    const left = buildNode(k - 1, source, target, aux, depth + 1);
    const right = buildNode(k - 1, aux, source, target, depth + 1);

    return {
      id,
      n: k,
      source,
      auxiliary: aux,
      target,
      depth,
      children: [left, right]
    };
  }

  return buildNode(n, "A", "B", "C", 1);
}
