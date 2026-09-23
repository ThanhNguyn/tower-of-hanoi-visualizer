export type Rod = "A" | "B" | "C";

export type AppMode = "play" | "solve" | "learn";

export type AlgorithmType = "recursive" | "iterative" | "binary";

export interface HanoiMove {
  id: number;
  disk: number;
  from: Rod;
  to: Rod;
  moveIndex: number;
  callId?: string;
  explanation: string;
}

export type HanoiRods = Record<Rod, number[]>;

export interface CallStackFrame {
  id: string;
  n: number;
  source: Rod;
  auxiliary: Rod;
  target: Rod;
  depth: number;
  stage: "entering" | "left-child" | "moving" | "right-child" | "returning";
}

export interface IterativeFrame {
  stepType: "odd" | "even";
  disk1Rod: Rod;
  disk1NextRod: Rod;
  disk1Cycle: Rod[];
  otherRods: [Rod, Rod];
  forcedMove: { from: Rod; to: Rod; disk: number } | null;
}

export interface BinaryFrame {
  stepNumber: number;
  binaryString: string;
  trailingZeros: number;
  activeBitIndex: number;
  disk: number;
  grayCode: string;
  prevGrayCode: string;
  flippedBitIndex: number;
}

export interface ExecutionStep {
  step: number;
  move: HanoiMove | null;
  stack: CallStackFrame[];
  rods: HanoiRods;
  activeCallId: string | null;
  explanation: string;
  iterativeFrame?: IterativeFrame;
  binaryFrame?: BinaryFrame;
}

export interface TreeNode {
  id: string;
  n: number;
  source: Rod;
  auxiliary: Rod;
  target: Rod;
  depth: number;
  moveNumber?: number;
  children: TreeNode[];
}

