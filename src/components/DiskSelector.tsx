interface DiskSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const diskCounts = [3, 4, 5, 6, 7, 8];

export function DiskSelector({ value, onChange, disabled = false }: DiskSelectorProps) {
  return (
    <fieldset className="flex items-center gap-3">
      <legend className="sr-only">Choose number of disks</legend>
      <span className="text-xs font-medium text-slate-400">Disks:</span>
      <div aria-label="Choose number of disks" className="flex items-center gap-1.5" role="radiogroup">
        {diskCounts.map((count) => {
          const selected = count === value;
          return (
            <button
              aria-checked={selected}
              className={`h-8 w-8 rounded-lg border text-xs font-mono font-medium transition ${
                selected
                  ? "border-amber-400/80 bg-amber-400/15 text-amber-300 font-bold shadow-sm"
                  : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/[0.15] hover:text-slate-200"
              } disabled:cursor-not-allowed disabled:opacity-40`}
              disabled={disabled}
              key={count}
              onClick={() => onChange(count)}
              role="radio"
              type="button"
            >
              {count}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

