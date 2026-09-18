# Design System: Recursive Flight Recorder

<!-- impeccable:design-schema 1 -->

## Direction & Thesis

**Theme:** Recursive Flight Recorder  
**Visitor Mode:** Operate & Learn  
**Concept:** A late-night instrument console designed for rigorous algorithmic observation. Rather than disjointed flashcard panels or toy-like cartoon graphics, the Tower of Hanoi puzzle is presented as an instrument under test. Every move writes an auditable trace; every recursive frame is preserved in an observable call stack.

---

## Palette & Surface Tokens

| Token | Hex / Value | Semantic Role |
|---|---|---|
| `ink-950` | `#090d13` | Deep viewport backdrop |
| `ink-900` | `#0d131c` | Active stage and well ground |
| `ink-850` | `#111924` | Primary instrument panels |
| `ink-800` | `#16202d` | Elevated controls and card borders |
| `copper-400` | `#e7ad72` | Primary active accent, active transport step, disk 2 |
| `copper-300` | `#f2ca9a` | Text highlight for metrics, selected badges |
| `signal-blue` | `#86b7ff` | Selection ring, active rod indicator, source path |
| `signal-green`| `#77d8ad` | Solved state, valid completion, target rod |
| `signal-red`  | `#f28e9c` | Illegal move feedback, invalid placement alert |

---

## Typography Hierarchy

- **UI Voice (`Archivo`):** Calibrated humanist sans serif with high legibility across screen sizes. Applied to headers, instructions, explanatory copy, and navigation controls.
- **Instrument Voice (`IBM Plex Mono`):** Fixed-width, tabular numerals strictly reserved for measured values, step counters ($17 / 31$), disk IDs, mathematical recurrence relations, and algorithm code blocks.

---

## Component Ecosystem

1. **Header & Mode Switcher (`Header.tsx`):**
   - Compact status bar with mode switcher (`Play`, `Solve`, `Learn`).
   - Quick reset trigger.
2. **Parameters Bar (`DiskSelector.tsx`):**
   - Discrete selector for $N \in [3, 8]$.
   - Keyboard shortcut hints (`Space`, `← / →`, `R`).
3. **The Centerpiece (`HanoiBoard.tsx`, `Rod.tsx`, `Disk.tsx`):**
   - Solid pedestal foundation with Source, Auxiliary, and Target indicators.
   - Disks width scaled proportionally from 28% to 96% with tactile metallic gradients.
   - Dual interaction: click-to-move and drag-and-drop.
   - Natural lift-glide-settle animation and subtle shake feedback on invalid moves.
4. **Instrument Rail (`StatisticsPanel.tsx`, `CallStack.tsx`):**
   - Live metrics: current move, minimum moves ($2^N - 1$), delta to optimal, progress bar.
   - Live Call Stack: displays exact active frames `hanoi(n, src, aux, dst)` and depth.
5. **Trace & Ledger (`RecursiveVisualizer.tsx`, `MoveHistory.tsx`):**
   - Recursive call tree highlighting left child, base move, and right child.
   - Step ledger allowing instantaneous time-travel to any step by clicking.
6. **Educational Foundation (`AlgorithmExplanation.tsx`):**
   - In-depth explanation of base case $n=1$, recursive case $n>1$, and mathematical induction proving $T(n) = 2^n - 1$.

---

## Craft Floor Verification

- **Contrast:** Silver-white text (`#eef2f7`, `#cbd5e1`) on dark ink surfaces satisfies WCAG AAA contrast ratios (&gt; 7:1).
- **Depth & Shadows:** Soft directional blurs (`shadow-panel`, `shadow-float`); zero hard neobrutalist offset shadows.
- **Motion:** Framer Motion spring physics with `prefers-reduced-motion` fallbacks.
- **Copy Integrity:** Strict standard terminology: "Tower of Hanoi", "Rod A (Source)", "Rod B (Auxiliary)", "Rod C (Target)", and "disks".
