interface DiskSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const diskCounts = [3, 4, 5, 6, 7, 8];

export function DiskSelector({ value, onChange, disabled = false }: DiskSelectorProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="field-label mb-2">Disk count</legend>
      <div aria-label="Choose number of disks" className="flex flex-wrap gap-1.5" role="radiogroup">
        {diskCounts.map((count) => {
          const selected = count === value;
          return (
            <button
              aria-checked={selected}
              className={`data-value min-h-9 min-w-9 rounded-lg border px-2 text-sm font-medium transition duration-200 ${
                selected
                  ? "border-copper-400/70 bg-copper-400/15 text-copper-300"
                  : "border-white/[0.09] bg-white/[0.025] text-slate-400 hover:border-white/[0.17] hover:text-slate-100"
              } disabled:cursor-not-allowed disabled:opacity-50`}
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
      <p className="mt-2 text-xs leading-5 text-slate-500">Changing disks resets the board, trace, and playback.</p>
    </fieldset>
  );
}
