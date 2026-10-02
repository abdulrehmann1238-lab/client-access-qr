import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helper,
  maxLength,
  value,
  id,
  className = '',
  disabled,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="w-full text-left">
      <div className="flex items-center justify-between mb-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[13px] font-medium text-ink-2 tracking-[0.02em]"
          >
            {label}
          </label>
        )}
        {maxLength && (
          <span className="text-[12px] text-ink-muted">
            {currentLength} / {maxLength}
          </span>
        )}
      </div>
      <div className="relative">
        <textarea
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          value={value}
          disabled={disabled}
          className={`
            w-full min-h-[96px] p-3.5 rounded-md bg-surface text-ink text-[16px] border transition-colors duration-150 resize-y
            placeholder:text-ink-muted
            focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/60
            disabled:bg-surface-raised disabled:text-ink-muted disabled:cursor-not-allowed
            ${error ? 'border-clinical-error focus:border-clinical-error focus:ring-clinical-error/20' : 'border-line-strong hover:border-[#B5AEA1]'}
            ${className}
          `}
          aria-invalid={!!error}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-[13px] text-clinical-error flex items-center gap-1.5" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helper ? (
        <p className="mt-1.5 text-[13px] text-ink-muted">{helper}</p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
