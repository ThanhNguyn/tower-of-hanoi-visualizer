# Tower of Hanoi 3D Tactile & Algorithmic Visualizer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Tower of Hanoi Visualizer into a state-of-the-art tactile 3D experience with an interactive Three.js WebGL canvas, dynamic SVG binary recursion tree, collision-free layout, unwinding call stack, arcade mechanical controls, and realistic physics-based audio.

**Architecture:** Dual-view rendering engine: Three.js WebGL Canvas (`Hanoi3DCanvas.tsx`) as the flagship 3D stage with smooth parabolic raycasted arcs, alongside an enhanced fail-safe 2D tactile board (`HanoiBoard.tsx`). The algorithmic trace engine is fixed to unwind the call stack cleanly upon completion, and the mock recursion panel is replaced by a dynamic SVG binary tree with active node highlights and click-to-jump.

**Tech Stack:** React 19, TypeScript 5.7, Three.js 0.174, Tailwind CSS 3.4, Framer Motion 12, Lucide React, Vitest 2.1.

**Spec:** `docs/superpowers/specs/2026-09-22-tower-of-hanoi-3d-redesign-design.md`

## Global Constraints

- Must pass 100% of tests in `npm test` (`vitest run`).
- TypeScript build must pass with zero errors (`npm run build`).
- Keep 100% compatibility with existing bilingual support (`useLanguage` hook and `translations.ts`).
- Preserved safety rollback branch: `backup-before-redesign` (commit `7fb73f2`).
- No regressions on disk count selection ($3 \le n \le 8$) and all 3 solvers (Recursive, Iterative, Binary).

## Review Focus

1. **Call Stack final state:** At step $2^n - 1$ (puzzle solved), the call stack must unwind to empty (`stack.length === 0`) and show the victory badge.
2. **Disk-peg label collision:** In 2D manual mode, clicking a disk to lift must never overlap or clip peg label pills.
3. **3D WebGL fallback:** If WebGL fails or on user preference, the app seamlessly toggles to the 2D tactile board with identical game state.
4. **Binary tree jump accuracy:** Clicking any node on the SVG binary tree must jump the simulation to that exact move index and board state.
5. **Memory & Animation cleanup:** `Hanoi3DCanvas` must properly clean up geometries, materials, animation frames, and resize observers on unmount.

---

### Task 1: Core Algorithm & Trace Engine Fixes (`hanoi.ts`)

**Files:**
- Modify: `src/algorithms/hanoi.ts:300-410`
- Test: `tests/hanoi.test.ts`

**Interfaces:**
- Consumes: `generateExecutionTrace(n: number, target?: Rod): ExecutionStep[]`
- Produces: `ExecutionStep[]` where step $2^n - 1$ or final completion has `stack: []` and accurate solved state.

- [ ] **Step 1: Write the failing test for call stack unwinding on completion**

Add the following test to `tests/hanoi.test.ts`:
```typescript
it("unwinds call stack to 0 frames when puzzle reaches completion step", () => {
  const n = 4;
  const trace = generateExecutionTrace(n);
  const totalMoves = Math.pow(2, n) - 1;
  const lastStep = trace[totalMoves];
  expect(lastStep).toBeDefined();
  expect(isPuzzleSolved(lastStep.rods, n, "C")).toBe(true);
  expect(lastStep.stack.length).toBe(0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL on "expected stack length to be 0".

- [ ] **Step 3: Update `generateExecutionTrace` in `src/algorithms/hanoi.ts`**

Modify `runTrace` to ensure that after all recursive subtrees and moves complete, the final step in `steps[totalMoves]` has an empty stack `stack: []` and an unrolled status, or append the unwound completed state:
```typescript
// In src/algorithms/hanoi.ts
// In generateExecutionTrace:
// After runTrace finishes:
if (steps.length > 0) {
  const finalStep = steps[steps.length - 1];
  finalStep.stack = [];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (all 9 tests pass).

- [ ] **Step 5: Commit**

```bash
git add src/algorithms/hanoi.ts tests/hanoi.test.ts
git commit -m "fix(algo): unwind call stack to empty on completion step"
```

---

### Task 2: Interactive Dynamic SVG Binary Recursion Tree (`RecursiveBinaryTree.tsx`)

**Files:**
- Create: `src/components/RecursiveBinaryTree.tsx`
- Modify: `src/components/RecursiveVisualizer.tsx`
- Modify: `src/i18n/translations.ts`

**Interfaces:**
- Consumes: `diskCount: number`, `activeMove: HanoiMove | null`, `currentStep: number`, `totalSteps: number`, `onSelectStep: (step: number) => void`
- Produces: Dynamic interactive binary tree component rendered with vector SVG paths, highlighting current active step and allowing node clicking to jump steps.

- [ ] **Step 1: Write helper logic to generate Binary Tree Nodes for Hanoi**

Generate the node hierarchy where each node has:
- `id`: unique string
- `disk`: number
- `step`: move index (1..$2^n-1$)
- `source`: Rod
- `target`: Rod
- `auxiliary`: Rod
- `x`, `y`: computed coordinate offsets
- `leftChild`, `rightChild`: child subtrees

- [ ] **Step 2: Build `RecursiveBinaryTree.tsx` component**

Render the binary tree with SVG `<path>` bezier connectors and `<g>` interactive node pills:
- Active step node has `animate-pulse` and bright golden/amber ring.
- Past steps have subtle green/muted borders.
- Future steps have dimmed borders.
- Clicking any node calls `onSelectStep(node.step)`.
- Wrap in scrollable/pan container for $n > 4$.

- [ ] **Step 3: Integrate into `RecursiveVisualizer.tsx`**

Replace the static 3-box mock in `RecursiveVisualizer.tsx` with `<RecursiveBinaryTree />`.

- [ ] **Step 4: Verify component rendering and TypeScript compilation**

Run: `npm run build`
Expected: TypeScript passes with zero errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/RecursiveBinaryTree.tsx src/components/RecursiveVisualizer.tsx src/i18n/translations.ts
git commit -m "feat: implement interactive dynamic SVG binary recursion tree"
```

---

### Task 3: Three.js 3D WebGL Canvas (`Hanoi3DCanvas.tsx`)

**Files:**
- Create: `src/components/Hanoi3DCanvas.tsx`
- Modify: `src/types/hanoi.ts`

**Interfaces:**
- Consumes:
  - `rods: HanoiRods`
  - `totalDisks: number`
  - `selectedRod: Rod | null`
  - `isInteractive: boolean`
  - `speed: number`
  - `onSelectRod: (rod: Rod) => void`
  - `cameraView: "isometric" | "front" | "top"`
- Produces: Full interactive 3D WebGL scene with Three.js:
  - Mahogany wood plinth base
  - 3 polished brass cylinder pegs
  - Chamfered 3D mineral disk cylinders with specular shine
  - Raycaster click interaction for selecting rods and disks
  - Parabolic arc flight animation during autonomous solve or manual moves

- [ ] **Step 1: Create `Hanoi3DCanvas.tsx` with Three.js scene setup**

Setup:
- PerspectiveCamera, WebGLRenderer with `antialias: true` and shadow map support.
- Directional light (sunlight) + Ambient light + Warm spotlight on the board.
- Chamfered wood plinth base mesh.
- 3 brass peg meshes at $X = -8, 0, 8$.
- Disk meshes mapped to current slot heights with dynamic radius based on disk number.

- [ ] **Step 2: Implement 3D Parabolic flight animation & Raycasting**

- In `requestAnimationFrame` loop, interpolate disk position along quadratic Bezier curve $(P_{start}, P_{apex}, P_{end})$ over duration scaled by `speed`.
- Raycaster on `pointerdown`: determine intersected peg (A, B, C) or top disk, and trigger `onSelectRod(rod)`.

- [ ] **Step 3: Add Camera angle transitions**

Support smooth camera interpolation between presets:
- Isometric: `(18, 18, 22)`
- Front: `(0, 10, 26)`
- Top: `(0, 28, 4)`

- [ ] **Step 4: Verify build and no memory leaks**

Ensure all geometries, materials, and renderer instances are disposed in the cleanup return of `useEffect`.
Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hanoi3DCanvas.tsx
git commit -m "feat(3d): add Three.js WebGL 3D Hanoi canvas with physics flight and raycasting"
```

---

### Task 4: 2D Board Polish & Collision-Free Peg Badges (`HanoiBoard.tsx` & `Disk.tsx`)

**Files:**
- Modify: `src/components/HanoiBoard.tsx`
- Modify: `src/components/Disk.tsx`

**Interfaces:**
- Consumes: `rods`, `totalDisks`, `selectedRod`, `shakeRod`, `hintMove`, `isInteractive`, `speed`, `onSelectRod`, `onDropDisk`
- Produces: Polished 2D tactile board with guaranteed clearance between floating disks and peg labels.

- [ ] **Step 1: Increase vertical clearance in `HanoiBoard.tsx`**

- Elevate board top padding to `pt-16` or place peg label badges in a dedicated elevated header row with independent `z-index`.
- Calculate `hoverTopY = poleHeight + 20` and adjust board height so disks hover strictly below peg badges.

- [ ] **Step 2: Upgrade 2D Disk styling in `Disk.tsx` with tactile 3D chamfer borders**

- Add multi-stop tactile gradients, top specular rim highlight, bottom bevel shadow, and crisp disk number badges.
- Optimize Framer Motion spring physics with `stiffness: 300, damping: 24`.

- [ ] **Step 3: Verify zero collision in browser**

Click Peg A in manual mode, verify disk floats gracefully with at least 24px clearance below the peg badges.

- [ ] **Step 4: Commit**

```bash
git add src/components/HanoiBoard.tsx src/components/Disk.tsx
git commit -m "fix(ui): eliminate disk hover collision with peg labels and polish tactile 2D disks"
```

---

### Task 5: Tactile Arcade Control Console & Audio Synthesis Polish (`UnifiedControls.tsx` & `audio.ts`)

**Files:**
- Modify: `src/components/UnifiedControls.tsx`
- Modify: `src/utils/audio.ts`

**Interfaces:**
- Consumes: Sound synthesis API with disk weight parameter.
- Produces:
  - Dual-bay tactile mechanical keyboard arcade console.
  - Realistic wooden thud sound with pitch scaled by disk mass: $f = 280 - 24 \times \text{disk}$.
  - Harmonic victory arpeggio on completion.

- [ ] **Step 1: Upgrade `audio.ts`**

- Add disk-mass frequency modulation to `sound.playDrop(diskNumber)`.
- Add wood resonance filter using `BiquadFilterNode` (`lowpass` at 1200Hz).
- Implement triumphant pentatonic victory chord sequence.

- [ ] **Step 2: Restructure `UnifiedControls.tsx` into Dual-Bay Arcade Deck**

- **Bay 1 (Manual Play):** Tactile mechanical keys for Hint (amber LED), Undo (slate), Reset (ruby).
- **Bay 2 (Playback Transport):** First, Prev, Auto-Solve Play/Pause (chunky arcade button with neon glow), Next, Last.
- **Center Bar:** Algorithm pill switches and Speed multiplier switches ($0.5\times, 1\times, 2\times, 4\times$).
- Add mechanical key press effect: `active:translate-y-[2px] active:shadow-inner`.

- [ ] **Step 3: Run build and unit tests**

Run: `npm test && npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/UnifiedControls.tsx src/utils/audio.ts
git commit -m "feat(ui): redesign controls as arcade console and polish tactile audio synthesis"
```

---

### Task 6: Dual-View Mode Switcher & Shell Integration (`App.tsx`, `Header.tsx`, `index.css`)

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/App.tsx`
- Modify: `src/index.css`
- Modify: `src/i18n/translations.ts`

**Interfaces:**
- Consumes: `viewMode: "3d" | "2d"`, camera presets, all visualizer sub-components.
- Produces: Complete unified app with seamless 3D Studio / 2D Classic toggle, responsive layout, and zero errors.

- [ ] **Step 1: Add View Mode Toggle to `Header.tsx`**

- Add a sleek tactile pill toggle: `[🧊 3D Studio | 📋 2D Classic]` with tooltips in Vietnamese and English.
- Add Camera Preset buttons when in 3D mode: `[Isometric, Front, Top-down]`.

- [ ] **Step 2: Wire View Mode into `App.tsx`**

- State: `const [viewMode, setViewMode] = useState<"3d" | "2d">("3d")`.
- Render `Hanoi3DCanvas` when `viewMode === "3d"`, and `HanoiBoard` when `viewMode === "2d"`.
- Synchronize rod selections and manual direct moves identically between both modes.

- [ ] **Step 3: End-to-end verification via Browser Subagent & Vitest**

- Run `npm test` -> all 9 tests pass.
- Run `npm run build` -> build succeeds.
- Launch browser subagent: verify 3D stage rendering, smooth disk flight, raycast clicking, camera switching, binary tree highlight, and 2D mode toggle.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.tsx src/App.tsx src/index.css src/i18n/translations.ts
git commit -m "feat: integrate dual-view 3D/2D visualizer with camera controls and polished shell"
```
