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

export interface ExecutionStep {
  step: number;
  move: HanoiMove | null;
  stack: CallStackFrame[];
  rods: HanoiRods;
  activeCallId: string | null;
  explanation: string;
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
