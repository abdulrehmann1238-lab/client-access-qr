import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  onBack: () => void;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  currentStep,
  totalSteps,
  title,
  onBack,
}) => {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[15px] font-medium text-ink-2 hover:text-primary transition-colors cursor-pointer py-1 -ml-1 pr-3"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-[13px] font-medium text-ink-muted">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-heading text-[24px] sm:text-[26px] font-medium text-ink">
          {title}
        </h1>
      </div>

      {/* Progress bar with segments */}
      <div className="flex gap-2 mt-4">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isComplete = i + 1 <= currentStep;
          return (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full bg-line overflow-hidden"
            >
              <div
                className={`h-full bg-primary transition-all duration-300 ease-out ${
                  isComplete ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
