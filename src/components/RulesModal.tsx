import { useState } from "react";
import { BookOpen, CheckCircle, Lightbulb, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  const [activeTab, setActiveTab] = useState<"rules" | "algorithms" | "legend">("rules");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white/[0.12] bg-[#0f1722] shadow-2xl overflow-hidden z-10"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 bg-ink-900/80">
            <div className="flex items-center gap-2.5">
              <BookOpen className="text-copper-400" size={20} />
              <h2 className="text-base font-semibold text-white">
                Tower of Hanoi Rules & Guide
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-white/[0.06] hover:text-white transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-white/[0.06] px-5 bg-black/20 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("rules")}
              className={`py-3 px-3 border-b-2 transition ${
                activeTab === "rules"
                  ? "border-copper-400 text-copper-300 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Game Rules
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("algorithms")}
              className={`py-3 px-3 border-b-2 transition ${
                activeTab === "algorithms"
                  ? "border-copper-400 text-copper-300 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Solving Paradigms
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("legend")}
              className={`py-3 px-3 border-b-2 transition ${
                activeTab === "legend"
                  ? "border-copper-400 text-copper-300 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Legend of Brahma
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-5 space-y-4 text-sm text-slate-300">
            {activeTab === "rules" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-copper-400/20 bg-copper-400/10 p-4">
                  <h3 className="font-semibold text-copper-200 flex items-center gap-2 mb-1">
                    <Lightbulb size={16} /> Objective
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Transfer all <strong className="text-white">N disks</strong> from{" "}
                    <strong className="text-copper-300">Rod A (Source)</strong> to{" "}
                    <strong className="text-signal-green">Rod C (Target)</strong>, using{" "}
                    <strong className="text-slate-300">Rod B (Auxiliary)</strong> as intermediate buffer.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    The 3 Canonical Rules
                  </h4>

                  <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                    <CheckCircle className="text-signal-green shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong className="text-white block mb-0.5">Rule 1: Only one disk moved at a time</strong>
                      <p className="text-xs text-slate-400">
                        You may only move a single disk during each turn.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                    <CheckCircle className="text-signal-green shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong className="text-white block mb-0.5">Rule 2: Only the top disk can be moved</strong>
                      <p className="text-xs text-slate-400">
                        Disks cannot be extracted from beneath other disks; only the topmost disk of any rod is movable.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                    <CheckCircle className="text-signal-green shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong className="text-white block mb-0.5">Rule 3: No larger disk on smaller disk</strong>
                      <p className="text-xs text-slate-400">
                        A disk may only be placed either onto an empty rod or on top of a larger disk.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-black/30 p-3.5 text-xs text-slate-400">
                  <span className="font-mono text-copper-300 font-semibold">Minimal Optimal Moves:</span>{" "}
                  Solving Tower of Hanoi with N disks always requires exactly{" "}
                  <code className="font-mono font-bold text-signal-green">2ⁿ - 1</code> moves.
                </div>
              </div>
            )}

            {activeTab === "algorithms" && (
              <div className="space-y-3.5">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-2">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-signal-blue" />
                    1. Recursive Algorithm (Divide & Conquer)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Decomposes problem into: (1) Move top N-1 disks to Auxiliary; (2) Move largest disk N directly to Target; (3) Move N-1 disks from Auxiliary to Target. Elegant, requiring O(N) call stack space.
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-2">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-copper-400" />
                    2. Iterative Algorithm (Alternating Strategy)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Stackless execution: On odd turns, cycle smallest Disk 1 (A → B → C if N even, or A → C → B if N odd). On even turns, make the single legal move possible between the two remaining rods. Requires O(1) space!
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-2">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-signal-green" />
                    3. Binary & Gray Code (Bitwise Counter)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Count from 1 to 2ⁿ - 1 in binary. At step k, the disk to move is determined by the lowest 1-bit (`ctz(k) + 1`). This establishes an isomorphism between the Tower of Hanoi, Gray codes, and the Sierpiński triangle!
                  </p>
                </div>
              </div>
            )}

            {activeTab === "legend" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
                  <h4 className="font-semibold text-copper-300 flex items-center gap-2">
                    <Sparkles size={16} /> The Legend of Brahma's Temple
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    According to ancient legend, in a temple at Kashi Vishwanath (Varanasi), Hindu priests were assigned by Brahma to transfer <strong className="text-white">64 sacred golden disks</strong> across three diamond needles according to the immutable rules.
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Prophecy holds that when the 64th golden disk is placed on the destination needle, the temple will crumble into dust and the universe will reach its end.
                  </p>
                  <div className="rounded-lg bg-black/40 p-3 font-mono text-xs text-signal-green border border-white/[0.08]">
                    Total moves = 2⁶⁴ - 1 = 18,446,744,073,709,551,615 steps.<br />
                    At 1 move per second nonstop, completing it requires approximately <strong>584.9 billion years</strong> (42× the age of our universe)!
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="border-t border-white/[0.08] px-5 py-3 bg-ink-900/60 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="control-button control-button-primary px-5 py-1.5 text-xs"
            >
              Got it, let's play!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
