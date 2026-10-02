import React from 'react';
import { Button } from '../ui/Button';

interface SuccessViewProps {
  reference: string;
  title: string;
  message: string;
  turnaroundNote?: string;
  onBackToMenu: () => void;
  onRequestAnother: () => void;
  anotherLabel?: string;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  reference,
  title,
  message,
  turnaroundNote = "Typical turnaround: same business day.",
  onBackToMenu,
  onRequestAnother,
  anotherLabel = "Request another",
}) => {
  return (
    <div
      className="w-full flex flex-col items-center justify-center py-6 px-2 text-center animate-fade-in"
      role="status"
      aria-live="polite"
    >
      {/* Animated Checkmark Circle */}
      <div className="w-20 h-20 rounded-full bg-secondary/80 text-primary flex items-center justify-center mb-6 ring-8 ring-secondary/30 transition-transform duration-500 scale-100">
        <svg
          className="w-10 h-10 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <span className="text-[12px] font-semibold tracking-wider text-ink-muted uppercase mb-1">
        Confirmation Reference
      </span>
      <div className="font-mono text-[22px] font-semibold text-primary bg-surface px-4 py-1.5 rounded-md border border-line-strong mb-5 select-all">
        {reference}
      </div>

      <h1 className="font-heading text-[28px] font-medium text-ink mb-2">
        {title}
      </h1>

      <p className="text-[15px] text-ink-2 max-w-[340px] leading-relaxed mb-4">
        {message}
      </p>

      {turnaroundNote && (
        <div className="w-full max-w-[340px] p-3 rounded-md bg-surface-raised border border-line text-[13px] text-ink-muted mb-8 text-center">
          {turnaroundNote}
        </div>
      )}

      <div className="w-full max-w-[340px] space-y-3">
        <Button variant="primary" onClick={onBackToMenu}>
          Back to menu
        </Button>
        <Button variant="ghost" onClick={onRequestAnother}>
          {anotherLabel}
        </Button>
      </div>
    </div>
  );
};
