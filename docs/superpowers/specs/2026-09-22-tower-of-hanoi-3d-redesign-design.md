# Design Specification: Tower of Hanoi 3D Tactile & Algorithmic Visualizer Overhaul

- **Date:** 2026-09-22
- **Topic:** Complete Visual & Algorithmic Redesign (3D WebGL Canvas, Dynamic SVG Binary Tree, Tactile Arcade Console, Physics Easing, Audio Polish)
- **Status:** Approved by User

---

## 1. Problem Statement & Objectives

### 1.1 Existing Limitations
1. **Visual Deficiencies ("UI Slop"):** Flat, gloomy dark palette (`slate-900` / muted amber), lack of depth and material textures. The disks are basic flat CSS gradient rectangles.
2. **Layout Collision:** When picking up a disk in manual mode, it floats up to `hoverTopY` and overlaps directly with the top peg labels (`Cọc A Nguồn`, `Cọc B Trung gian`, etc.).
3. **Logic & State Bug (Call Stack Unwind):** At the completion step ($2^n - 1$), the call stack remains locked at maximum depth ($n/n$ frames) rather than unwinding to an empty, completed state.
4. **Mocked Recursion Visualizer:** The current "Recursive Visualizer" renders only 3 hardcoded static boxes rather than a true recursive binary tree decomposition ($O(2^n)$ nodes).
5. **Animation & Interaction:** Disk movement lacks physical inertia, smooth arc easing, and tactile feedback.

### 1.2 Target Objectives
1. **Tactile 3D / Isometric Arcade Aesthetic:** High-end physical craftsmanship feel with deep walnut wood plinth, brass/chrome metallic rods with specular reflection, tactile beveled mineral disks, and arcade-style mechanical control buttons.
2. **Dual-View Rendering Engine:**
   - **Primary 3D Studio:** Interactive Three.js WebGL canvas with realistic lighting, shadows, 3D parabolic arcs, camera angle presets (Isometric, Front, Top-down), and direct 3D raycast click interaction.
   - **2D Tactile Studio (Fail-Safe Toggle):** Polished 2D DOM version with tactile shadows, ensuring 100% availability on any hardware.
3. **Interactive Dynamic SVG Binary Tree (`RecursiveBinaryTree`):** Real-time divide-and-conquer binary tree visualizer that highlights active call frames with glowing pulses and allows clicking any node to jump to that execution step.
4. **Reliability & Test Integrity:** Zero regression on existing algorithmic solvers and 100% passing Vitest test suite.

---

## 2. Architecture & Component Decomposition

### 2.1 Component Hierarchy
```text
App (LanguageProvider)
├── Header (Brand Emblem, View Mode Toggle: 3D/2D, Sound Toggle, Rules Button)
├── GlobalBar (Disk Selector [3..8], Camera Preset Selector in 3D, Keyboard Hints)
├── CompletionPanel (Victory Fanfare, Move Statistics, Replay Trigger)
├── MainStage (12-column Grid)
│   ├── Left Column (8 cols):
│   │   ├── Hanoi3DCanvas (Three.js WebGL Scene) [when viewMode === "3d"]
│   │   │   └── OrbitControls, Spotlights, Wood Plinth, Metal Pegs, 3D Disks
│   │   ├── HanoiBoard (2D Tactile Fallback) [when viewMode === "2d"]
│   │   └── ArcadeControlConsole (Dual-bay mechanical keys: Manual & Simulation Transport)
│   └── Right Column (4 cols):
│       ├── StatisticsPanel (Move counter, Minimal moves, Shortest-path distance, Timer)
│       └── CallStack (Animated stack frames with stage tags, unwinds cleanly on completion)
├── SubStage (12-column Grid)
│   ├── Left Column (7 cols):
│   │   └── RecursiveBinaryTree (SVG Binary Tree Graph, live step pulse, jump-to-step)
│   └── Right Column (5 cols):
│       └── MoveHistory (Interactive move ledger with peg badge chips and autoscroll)
├── AlgorithmExplanation (Deep dive: Divide & conquer recurrence, Iterative cycle, Gray code)
└── RulesModal (Illustrated guide & constraints)
```

---

## 3. Detailed Specifications

### 3.1 3D Canvas (`src/components/Hanoi3DCanvas.tsx`)
- **Technology:** Three.js (`three` + `@types/three`), canvas mounted in a responsive container with `ResizeObserver`.
- **Scene Setup:**
  - Perspective camera ($45^\circ$ FOV), initial position `(0, 16, 26)`, looking at `(0, 4, 0)`.
  - Ambient light (intensity 0.55) + Directional Key Light with soft shadows + Warm Spot Light directed onto the center peg.
  - Base: Chamfered wood plinth (`BoxGeometry` with dark walnut mahogany wood texture/material).
  - Pegs: 3 vertical metallic cylinders (`CylinderGeometry` with `roughness: 0.15`, `metalness: 0.85`).
  - Sockets: Milled brass collar rings at the base of each peg.
  - Disks: Cylinders with chamfered bevels or double-sided rounded rims. Colors:
    - Disk 1: Amber Gold (`#F59E0B`)
    - Disk 2: Tangerine Flame (`#EA580C`)
    - Disk 3: Crimson Rose (`#E11D48`)
    - Disk 4: Amethyst Purple (`#9333EA`)
    - Disk 5: Royal Sapphire (`#2563EB`)
    - Disk 6: Emerald Jade (`#059669`)
    - Disk 7: Olive Lime (`#65A30D`)
    - Disk 8: Titanium Slate (`#475569`)
- **3D Animation:**
  - When moving from peg $P_1$ to peg $P_2$: disk animates along a 3-point quadratic Bezier curve $(P_1, Apex, P_2)$ over duration $T = \max(140\text{ms}, 700 / \text{speed})$.
  - Easing: Smooth cubic ease-in-out with subtle landing squash/bounce.
- **Interactions:**
  - Three.js Raycaster detects clicks on pegs and disks.
  - Click on top disk of rod A -> lifts to hover height. Click rod C -> executes move.
  - Camera view switch buttons:
    - **Isometric (Default):** `(18, 18, 22)`
    - **Front 3D:** `(0, 10, 28)`
    - **Top-Down:** `(0, 30, 6)`

### 3.2 Dynamic Interactive Binary Recursion Tree (`src/components/RecursiveBinaryTree.tsx`)
- **Mathematical Structure:**
  - Complete binary tree of height $n$: root is `hanoi(n, A, B, C)`.
  - Left child: `hanoi(n-1, A, C, B)`.
  - Middle action: `Move disk n: A -> C` (represented as the node's visit step).
  - Right child: `hanoi(n-1, B, A, C)`.
- **SVG Rendering Engine:**
  - Dynamically calculates tree layout $(x, y)$ coordinates with level separation and branch curves.
  - Nodes rendered as rounded pill capsules with disk index and peg roles.
  - Connector curves: Cubic bezier SVG paths with subtle glow.
  - Active Node: Pulsing golden/cyan border with radial glow indicator.
  - Completed Nodes: Muted green border with check icon.
  - Interactivity: Click any node to invoke `goToStep(stepNumber)`.
  - Zoom & Pan container for $n \ge 5$ to maintain clarity.

### 3.3 Core Logic Fixes (`src/algorithms/hanoi.ts` & `src/hooks/useHanoiSimulation.ts`)
1. **Call Stack Completion State:**
   - In `generateExecutionTrace`: when the simulation finishes the final move ($2^n - 1$), append a final unwound step or set `stack: []` at the final state so the UI displays `Đã hoàn thành! (0 khung chờ)` instead of locking at max depth.
2. **Peg Label Layout Clearance:**
   - In `HanoiBoard.tsx`, increase the board top ceiling padding and position the peg badges with `z-index` and elevation that prevents any clipping or overlap by floating disks.

### 3.4 Tactile Arcade Control Deck (`src/components/UnifiedControls.tsx`)
- **Dual-Bay Console:**
  - **Left Bay (Manual Play):** Tactile mechanical keys for `[Gợi ý (Hint)]`, `[Hoàn tác (Undo)]`, `[Làm lại (Reset)]`.
  - **Right Bay (Simulation Transport):** Transport playback controls `[|<<]`, `[<]`, `[Auto-Solve (Play/Pause)]`, `[>]`, `[>>|]`.
  - **Center Bay (Algorithm & Speed):** Segmented buttons for Recursive, Iterative, Binary, and Speed multipliers ($0.5\times, 1\times, 2\times, 4\times$).
- **Micro-Interactions:**
  - Satisfying 3D button press: `active:translate-y-[2px]` with recessed drop-shadow transition.
  - LED status diodes: small glowing indicators for active algorithm and play state.

### 3.5 Synthesized Audio Engine (`src/utils/audio.ts`)
- Web Audio API synthesizer:
  - **Pickup sound:** Crisp wooden tap with upward frequency pitch.
  - **Drop sound:** Deep resonant wooden thud with frequency dynamically mapped to disk weight:
    $$f(\text{disk}) = 280 - (\text{disk} \times 24)\,\text{Hz}$$
    (Larger disks create deeper, heavier thuds).
  - **Victory chime:** Ascending pentatonic arpeggio $(C_5, E_5, G_5, B_5, C_6)$ on puzzle completion.
  - Full mute toggle support and clean cleanup of audio nodes.

---

## 4. Verification & Testing Plan

### 4.1 Automated Tests
- Run `npm test` (`vitest run`):
  - Must pass 100% of the 8 test suites in `tests/hanoi.test.ts`.
  - Add tests verifying the unwound final step of `generateExecutionTrace`.
- Run `npm run build` (`tsc -b && vite build`) to confirm TypeScript type safety with Three.js.

### 4.2 Interactive Browser Testing (Browser Subagent)
1. Verify 3D canvas loads cleanly without WebGL shader errors.
2. Test camera angle buttons (Isometric, Front, Top-down).
3. Test 3D click-to-move manual interaction: click top disk on Peg A -> lifts up -> click Peg C -> glides and drops onto Peg C.
4. Test Auto-Solve playback at $1\times, 2\times, 4\times$: verify silky parabolic arc trajectories.
5. Verify Call Stack properly unrolls to 0 when finished.
6. Verify Recursive Binary Tree highlights current active node and supports clicking nodes to jump steps.
7. Test View Mode toggle (3D Studio <-> 2D Classic) to ensure 100% reliable fallback.
8. Verify responsive behavior across desktop and tablet viewports.
