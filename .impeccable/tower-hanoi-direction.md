# Tower of Hanoi Visualizer

Scope: root application · Visitor mode: Operate

Audience, job, and action: Students and self-directed developers use a browser-based workspace to make legal Tower of Hanoi moves, play a generated recursive solution, and inspect the exact recursive execution that produced it. The task is to replace memorization with an interactive mental model of recursion.

Content and constraints: The actual three-rod puzzle, 3–8 disks, validated manual play, typed recursive move generation, playback, move history, changing call stack, base and recursive cases, and the move-count recurrence must remain connected. The app is frontend-only, responsive, static-deployable, and accessible. The board is always the visual centerpiece.

## Direction contract

**THESIS** — A recursive flight recorder: one live mechanical puzzle is treated as an instrument under test, where every move leaves an auditable trace and every recursive frame has a visible place in the mechanism. It refuses the generic dashboard of disconnected summary cards.

**OWN-WORLD** — A restrained late-night instrument console: graphite and ink-blue grounds, silver-white working text, restrained copper for active motion, lucid blue for selection, and semantic green/red only for success and error. Archivo gives the tool a calibrated humanist voice; a monospace face is reserved for measured values and pseudocode. Thin rules, inset wells, tabular numerals, and low-elevation panel surfaces create structure without decorative glass or neon.

**STORY** — A learner begins by selecting a rod and moving a disk. The same workspace lets them switch to Solver, where transport controls advance a real trace. The board, active move, recursive frame, and call stack update together, making the recurrence legible rather than merely stated.

**FIRST VIEWPORT** — At desktop scale, a compact product bar anchors the top. A broad central tower stage dominates the left and center; its base contains direct manual/simulation controls. A narrow right instrument rail carries live statistics and the current recursive frame. The move ledger and learning material continue below the stage. On mobile, the board remains first, then controls, trace, and explanatory material in that order.

**FORM** — Recursive Flight Recorder, derived from the assigned jet-age ticket-wallet seed (key `59f140f4`) and translated to the brief's dark-first environment: retained trace strips replace paper coupons; an active step is a precise transport marker rather than a glowing decoration; completion stamps the result without hiding the recorded path. The named signature interaction is synchronized disk transport and trace advancement: lift, traverse, settle, then update the call stack and ledger as one causal event.

**FINISH** — unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
