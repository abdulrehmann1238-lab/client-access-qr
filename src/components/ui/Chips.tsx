import React from 'react';

interface ChipOption<T = string> {
  value: T;
  label: string;
  badge?: string;
}

interface ChipGroupProps<T = string> {
  options: ChipOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}

export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: ChipGroupProps<T>) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`
              h-[44px] px-4 rounded-full text-[14px] font-medium transition-all duration-150 select-none cursor-pointer flex items-center gap-1.5 active:scale-95
              focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-focus
              ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface text-ink-2 border border-line-strong hover:border-primary/60 hover:text-ink'
              }
            `}
          >
            <span>{opt.label}</span>
            {opt.badge && (
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-surface-raised text-ink-muted'
                }`}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface MultiChipGroupProps<T = string> {
  options: ChipOption<T>[];
  selectedValues: T[];
  onChange: (vals: T[]) => void;
  className?: string;
}

export function MultiChipGroup<T extends string>({
  options,
  selectedValues,
  onChange,
  className = '',
}: MultiChipGroupProps<T>) {
  const toggle = (val: T) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((opt) => {
        const isSelected = selectedValues.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`
              h-[44px] px-4 rounded-full text-[14px] font-medium transition-all duration-150 select-none cursor-pointer flex items-center gap-1.5 active:scale-95
              focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-focus
              ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface text-ink-2 border border-line-strong hover:border-primary/60 hover:text-ink'
              }
            `}
          >
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
