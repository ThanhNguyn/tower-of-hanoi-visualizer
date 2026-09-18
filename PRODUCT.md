# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React, TypeScript, Vite, Tailwind CSS, Motion / Framer Motion, Lucide React. The product is a frontend-only static site intended for GitHub Pages deployment.

## Users

Students and self-directed developers learning data structures, algorithms, and recursion. They need to play the puzzle themselves, observe a correct recursive solution, and connect every visible move to the algorithm's execution.

## Product Purpose

Tower of Hanoi Visualizer is an interactive learning experience for the Tower of Hanoi problem. It makes recursion understandable through three connected experiences: solving the puzzle manually, watching the recursive algorithm solve it, and inspecting the execution trace that creates each move.

## Positioning

Rather than treating gameplay, a solver, and an explanation as separate demos, the product keeps one canonical Tower of Hanoi model connecting the board, generated move sequence, playback state, recursive calls, and call stack. The intended learning path is: Play → Solve → Visualize → Understand.

## Operating Context

The product runs locally in a browser as a responsive learning tool. Learners can select 3–8 disks, make validated manual moves, or control automatic playback step by step while reading the associated recursive context, move history, and complexity explanation.

## Capabilities and Constraints

- The board has exactly three rods: Rod A (Source), Rod B (Auxiliary), and Rod C (Target).
- The application uses the real generic recursive Tower of Hanoi algorithm; it must not hard-code sequences for particular disk counts.
- Manual play enforces all Tower of Hanoi rules and gives non-intrusive feedback for invalid moves.
- Simulation supports first, previous, play, pause, next, last, and reset actions; changing disk count cancels active playback safely and regenerates derived state.
- The visualizer exposes move history, recursive calls, recursion depth, a changing call stack, the base case, recursive case, and the relationship T(n) = 2T(n - 1) + 1 = 2^n - 1.
- No backend, database, authentication, or API server may be introduced.
- The application must remain smooth for 3–8 disks and respect reduced-motion preferences.

## Brand Commitments

The product name is **Tower of Hanoi Visualizer**. English is the primary interface language. The requested presentation is a polished, restrained, dark-first developer/education product with the interactive board as its visual centerpiece; it must avoid generic classroom or Bootstrap styling.

## Evidence on Hand

The initial repository contains no supplied visual assets, product copy, screenshots, or existing implementation. Do not fabricate testimonials, customers, benchmarks, or other proof. The algorithm, terminology, behavioral requirements, and deployment target are supplied in the project brief.

## Product Principles

1. Make the algorithm's invisible work visible at the exact moment it affects the board.
2. Preserve the integrity of the puzzle and recursive algorithm over visual shortcuts.
3. Let learners progress from direct manipulation to guided inspection without changing mental models.
4. Keep complex information scannable and controllable at every screen size.
5. Treat accessible, predictable controls as part of the learning experience.

## Accessibility & Inclusion

Use semantic HTML, keyboard-accessible controls, clear focus states, adequate contrast, touch-friendly targets, ARIA labels where useful, and equivalent functionality with reduced motion enabled. Keyboard shortcuts must not interfere with text inputs or selects.
