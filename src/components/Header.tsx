import { GraduationCap, PlayCircle, RotateCcw, Swords } from "lucide-react";

export type AppMode = "play" | "solve" | "learn";

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onReset: () => void;
}

const modes: Array<{
  id: AppMode;
  label: string;
  description: string;
  icon: typeof Swords;
}> = [
  { id: "play", label: "Play", description: "Solve it yourself", icon: Swords },
  { id: "solve", label: "Solve", description: "Run the recursion", icon: PlayCircle },
  { id: "learn", label: "Learn", description: "Inspect the algorithm", icon: GraduationCap }
];

export function Header({ mode, onModeChange, onReset }: HeaderProps) {
  return (
    <header className="mb-5 flex flex-col gap-4 border-b border-white/[0.08] pb-5 lg:mb-7 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="grid h-10 w-10 place-items-center rounded-xl bg-copper-400 text-[#191512] shadow-[0_10px_24px_-16px_rgba(231,173,114,0.95)]"
        >
          <span className="font-mono text-sm font-semibold">H</span>
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-[-0.035em] text-white sm:text-2xl">
            Tower of Hanoi Visualizer
          </h1>
          <p className="mt-0.5 text-sm text-slate-400">Play the puzzle. Trace the recursion. See why every move matters.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <nav aria-label="Learning mode" className="instrument-well flex items-center p-1">
          {modes.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === mode;

            return (
              <button
                aria-pressed={isActive}
                className={`mode-button ${isActive ? "mode-button-active" : ""}`}
                key={item.id}
                onClick={() => onModeChange(item.id)}
                title={item.description}
                type="button"
              >
                <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <button className="control-button control-button-quiet" onClick={onReset} type="button">
          <RotateCcw aria-hidden="true" size={16} />
          Reset
        </button>
      </div>
    </header>
  );
}
