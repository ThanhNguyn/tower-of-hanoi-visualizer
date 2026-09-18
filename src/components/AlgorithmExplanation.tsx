import { BookOpen, Calculator, Sparkles } from "lucide-react";

interface AlgorithmExplanationProps {
  currentDisks: number;
}

export function AlgorithmExplanation({ currentDisks }: AlgorithmExplanationProps) {
  const minMoves = Math.pow(2, currentDisks) - 1;

  return (
    <section aria-labelledby="algorithm-heading" className="space-y-6">
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
        <BookOpen className="text-copper-400" size={20} />
        <h2 id="algorithm-heading" className="section-heading">
          Understanding the Recursive Algorithm
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Base Case & Recursive Case */}
        <div className="lg:col-span-2 space-y-4">
          <div className="instrument-panel p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-signal-blue" />
              1. The Base Case (n = 1)
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              When there is only <strong className="text-white">1 disk</strong>, no other disks obstruct it. It can immediately be moved directly from the Source rod to the Target rod without needing any buffer or auxiliary rod.
            </p>
            <div className="rounded-lg bg-black/40 p-3 font-mono text-xs text-slate-300 border border-white/[0.06]">
              <span className="text-copper-400">if</span> (n === 1) &#123;<br />
              &nbsp;&nbsp;move(source, target);<br />
              &nbsp;&nbsp;<span className="text-copper-400">return</span>;<br />
              &#125;
            </div>
          </div>

          <div className="instrument-panel p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-copper-400" />
              2. The Recursive Case (n &gt; 1)
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              To move <strong className="text-white">N disks</strong> from Source to Target according to the rules, the problem decomposes into 3 sequential sub-problems:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300 pl-1">
              <li>
                <strong className="text-slate-100">Step 1:</strong> Recursively move the top <code className="font-mono text-xs text-copper-300">N - 1</code> disks from <strong className="text-slate-200">Source</strong> to <strong className="text-slate-200">Auxiliary</strong> (using Target as buffer).
              </li>
              <li>
                <strong className="text-slate-100">Step 2:</strong> Move the largest disk <code className="font-mono text-xs text-copper-300">N</code> directly from <strong className="text-slate-200">Source</strong> to <strong className="text-slate-200">Target</strong>.
              </li>
              <li>
                <strong className="text-slate-100">Step 3:</strong> Recursively move the <code className="font-mono text-xs text-copper-300">N - 1</code> disks from <strong className="text-slate-200">Auxiliary</strong> to <strong className="text-slate-200">Target</strong> (using Source as buffer).
              </li>
            </ol>
            <div className="rounded-lg bg-black/40 p-3 font-mono text-xs text-slate-300 border border-white/[0.06] overflow-x-auto">
              hanoi(n - 1, source, target, auxiliary); <span className="text-slate-500">// Step 1</span><br />
              move(disk_n, source, target); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">// Step 2</span><br />
              hanoi(n - 1, auxiliary, source, target); <span className="text-slate-500">// Step 3</span>
            </div>
          </div>
        </div>

        {/* Mathematical Proof & Recurrence */}
        <div className="space-y-4">
          <div className="instrument-panel p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Calculator className="text-copper-400" size={16} />
              Recurrence Relation & Math
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Let <code className="font-mono text-copper-300">T(n)</code> be the number of moves needed to solve a puzzle with <code className="font-mono text-copper-300">n</code> disks:
            </p>
            <div className="rounded-lg bg-black/40 p-3 font-mono text-xs text-center border border-white/[0.06] text-copper-300 space-y-1">
              <div>T(1) = 1</div>
              <div>T(n) = 2 · T(n - 1) + 1</div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unrolling this geometric series:
            </p>
            <div className="text-xs font-mono text-slate-300 pl-2 border-l border-white/[0.1] space-y-0.5">
              <div>T(n) = 2(2T(n-2) + 1) + 1</div>
              <div>T(n) = 2²T(n-2) + 2¹ + 2⁰</div>
              <div>T(n) = 2ⁿ⁻¹ + ... + 2¹ + 2⁰</div>
              <div className="text-signal-green font-bold pt-1">T(n) = 2ⁿ - 1</div>
            </div>
          </div>

          <div className="instrument-panel p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="text-signal-green" size={16} />
              Complexity Analysis
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-400">Time Complexity:</span>
                <span className="text-signal-green font-semibold">O(2ⁿ)</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-400">Space (Call Stack):</span>
                <span className="text-copper-300 font-semibold">O(n)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current N = {currentDisks}:</span>
                <span className="text-white font-bold">{minMoves} moves</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
