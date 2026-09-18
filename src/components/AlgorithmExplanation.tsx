import { useState } from "react";
import { BookOpen, Calculator, Cpu, Sparkles } from "lucide-react";

interface AlgorithmExplanationProps {
  currentDisks: number;
}

export function AlgorithmExplanation({ currentDisks }: AlgorithmExplanationProps) {
  const [activeTab, setActiveTab] = useState<"recursive" | "iterative" | "binary">("recursive");
  const minMoves = Math.pow(2, currentDisks) - 1;

  return (
    <section aria-labelledby="algorithm-heading" className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="text-copper-400" size={20} />
          <h2 id="algorithm-heading" className="section-heading">
            Deep-Dive into Algorithm Paradigms
          </h2>
        </div>

        {/* Algorithm Strategy Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-black/40 p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("recursive")}
            className={`px-3 py-1 rounded transition ${
              activeTab === "recursive"
                ? "bg-copper-400/20 text-copper-300 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            1. Recursive (Divide & Conquer)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("iterative")}
            className={`px-3 py-1 rounded transition ${
              activeTab === "iterative"
                ? "bg-copper-400/20 text-copper-300 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            2. Iterative (State Machine)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("binary")}
            className={`px-3 py-1 rounded transition ${
              activeTab === "binary"
                ? "bg-copper-400/20 text-copper-300 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            3. Binary (Gray Code)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Explanation Column */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === "recursive" && (
            <>
              <div className="instrument-panel p-5 space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-signal-blue" />
                  Base Case (n = 1)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  When there is only <strong className="text-white">1 disk</strong>, no other disks obstruct it. It can immediately be moved directly from Source to Target without needing any intermediate auxiliary buffer.
                </p>
                <div className="rounded-lg bg-black/40 p-3 font-mono text-xs text-slate-300 border border-white/[0.06]">
                  <span className="text-copper-400">if</span> (n === 1) &#123;<br />
                  &nbsp;&nbsp;moveDisk(source, target);<br />
                  &nbsp;&nbsp;<span className="text-copper-400">return</span>;<br />
                  &#125;
                </div>
              </div>

              <div className="instrument-panel p-5 space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-copper-400" />
                  Recursive Case (n &gt; 1)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  To move <strong className="text-white">N disks</strong> from Source to Target according to the rules, the problem decomposes into 3 sequential sub-problems:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-300 pl-1">
                  <li>
                    <strong className="text-slate-100">Step 1:</strong> Recursively move top <code className="font-mono text-xs text-copper-300">N - 1</code> disks from <strong>Source</strong> to <strong>Auxiliary</strong> (using Target as buffer).
                  </li>
                  <li>
                    <strong className="text-slate-100">Step 2:</strong> Move largest disk <code className="font-mono text-xs text-copper-300">N</code> directly from <strong>Source</strong> to <strong>Target</strong>.
                  </li>
                  <li>
                    <strong className="text-slate-100">Step 3:</strong> Recursively move <code className="font-mono text-xs text-copper-300">N - 1</code> disks from <strong>Auxiliary</strong> to <strong>Target</strong> (using Source as buffer).
                  </li>
                </ol>
                <div className="rounded-lg bg-black/40 p-3 font-mono text-xs text-slate-300 border border-white/[0.06] overflow-x-auto">
                  hanoi(n - 1, source, target, auxiliary); <span className="text-slate-500">// Step 1</span><br />
                  moveDisk(n, source, target); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">// Step 2</span><br />
                  hanoi(n - 1, auxiliary, source, target); <span className="text-slate-500">// Step 3</span>
                </div>
              </div>
            </>
          )}

          {activeTab === "iterative" && (
            <div className="instrument-panel p-5 space-y-3.5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Cpu className="text-copper-400" size={17} />
                Stackless Iterative Algorithm (State Machine)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                For large disk counts, recursive depth risks stack overflow. The iterative approach solves Tower of Hanoi with <strong className="text-signal-green">O(1) auxiliary space</strong> via alternating parity:
              </p>
              <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4 space-y-2.5 text-xs text-slate-300">
                <div className="font-semibold text-copper-300">Alternating 2-Step Pattern:</div>
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  <li>
                    <strong>Odd Turns (1, 3, 5, ...):</strong> Always cycle <strong className="text-white">Disk 1 (smallest)</strong> to the next rod along its fixed rotational cycle:
                    <br />
                    <span className="font-mono text-copper-300 pl-4">
                      {currentDisks % 2 === 0 ? "A → B → C → A (even N)" : "A → C → B → A (odd N)"}
                    </span>
                  </li>
                  <li>
                    <strong>Even Turns (2, 4, 6, ...):</strong> There is always exactly ONE legal move between the two rods that do not contain Disk 1 (place the smaller disk onto the larger disk).
                  </li>
                </ul>
              </div>
              <p className="text-xs text-slate-400">
                Repeating these two deterministic rules yields the exact minimal optimal solution without maintaining any call stack!
              </p>
            </div>
          )}

          {activeTab === "binary" && (
            <div className="instrument-panel p-5 space-y-3.5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="text-signal-green" size={17} />
                Binary Gray Code & Bitwise Counters
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The Tower of Hanoi is isomorphic to binary counting and reflected binary Gray codes. Counting from <code className="font-mono text-copper-300">1 to 2ⁿ - 1</code> in binary:
              </p>
              <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4 space-y-2 text-xs text-slate-300 font-mono">
                <div>Step 1 = 001₂ → Trailing zeros = 0 → Move Disk 1</div>
                <div>Step 2 = 010₂ → Trailing zeros = 1 → Move Disk 2</div>
                <div>Step 3 = 011₂ → Trailing zeros = 0 → Move Disk 1</div>
                <div>Step 4 = 100₂ → Trailing zeros = 2 → Move Disk 3</div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                At any step <code className="font-mono text-copper-300">k</code>, the disk to move is determined by the lowest 1-bit index: <code className="font-mono text-signal-green">ctz(k) + 1</code>. This can be computed in <strong className="text-white">O(1)</strong> hardware instructions!
              </p>
            </div>
          )}
        </div>

        {/* Math & Complexity Column */}
        <div className="space-y-4">
          <div className="instrument-panel p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Calculator className="text-copper-400" size={16} />
              Mathematical Recurrence
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Let <code className="font-mono text-copper-300">T(n)</code> be the minimal number of moves required for n disks:
            </p>
            <div className="rounded-lg bg-black/40 p-3 font-mono text-xs text-center border border-white/[0.06] text-copper-300 space-y-1">
              <div>T(1) = 1</div>
              <div>T(n) = 2 · T(n - 1) + 1</div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Unrolling the geometric series:</p>
            <div className="text-xs font-mono text-slate-300 pl-2 border-l border-white/[0.1] space-y-0.5">
              <div>T(n) = 2(2T(n-2) + 1) + 1</div>
              <div>T(n) = 2ⁿ⁻¹ + ... + 2¹ + 2⁰</div>
              <div className="text-signal-green font-bold pt-1 text-sm">T(n) = 2ⁿ - 1</div>
            </div>
          </div>

          <div className="instrument-panel p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="text-signal-green" size={16} />
              Complexity Comparison
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-400">Time Complexity:</span>
                <span className="text-signal-green font-semibold">O(2ⁿ)</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-400">Recursive Space:</span>
                <span className="text-copper-300 font-semibold">O(n)</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-400">Iterative Space:</span>
                <span className="text-signal-blue font-semibold">O(1)</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-slate-300">N = {currentDisks} disks:</span>
                <span className="text-white font-bold">{minMoves} moves</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
