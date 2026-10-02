import React from 'react';
import { Check } from 'lucide-react';
import { Medication } from '../../store/useSession';

interface MedicationRowProps {
  medication: Medication;
  isSelected: boolean;
  onToggle: () => void;
}

export const MedicationRow: React.FC<MedicationRowProps> = ({
  medication,
  isSelected,
  onToggle,
}) => {
  const needsApproval = medication.refillsRemaining === 0;

  return (
    <div
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`
        w-full p-4 rounded-lg bg-surface border transition-all duration-150 cursor-pointer select-none text-left
        flex items-start justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-focus
        ${
          isSelected
            ? 'border-primary ring-1 ring-primary bg-[#FAFBF9]'
            : 'border-line hover:border-line-strong active:bg-surface-raised'
        }
      `}
    >
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h4 className="font-heading text-[16px] sm:text-[17px] font-medium text-ink">
            {medication.name}
          </h4>
          {needsApproval && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F3EDE6] text-ink-2 border border-line">
              Needs prescriber approval
            </span>
          )}
        </div>
        <p className="text-[13px] text-ink-2 font-medium">
          {medication.strength}
        </p>
        <p className="text-[12px] text-ink-muted mt-1">
          {medication.instructions}
        </p>
        <div className="flex items-center gap-3 mt-2 text-[12px] text-ink-muted">
          <span>Last filled: {medication.lastFilled}</span>
          <span>•</span>
          <span className={needsApproval ? 'text-[#A05C26] font-medium' : 'text-primary font-medium'}>
            {needsApproval ? '0 refills remaining' : `${medication.refillsRemaining} refill${medication.refillsRemaining > 1 ? 's' : ''} left`}
          </span>
        </div>
      </div>

      {/* Checkbox circle/box */}
      <div
        className={`
          w-6 h-6 rounded-md border mt-0.5 shrink-0 flex items-center justify-center transition-colors duration-150
          ${
            isSelected
              ? 'bg-primary border-primary text-white'
              : 'border-line-strong bg-surface'
          }
        `}
      >
        {isSelected && <Check className="w-4 h-4 stroke-[2.5]" />}
      </div>
    </div>
  );
};
