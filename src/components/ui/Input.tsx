import React, { forwardRef } from 'react';
import { AlertCircle, Check } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helper?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  helper,
  id,
  className = '',
  disabled,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[13px] font-medium text-ink-2 mb-1.5 tracking-[0.02em]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`
            w-full h-[56px] px-4 rounded-md bg-surface text-ink text-[16px] border transition-colors duration-150
            placeholder:text-ink-muted
            focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/60
            disabled:bg-surface-raised disabled:text-ink-muted disabled:cursor-not-allowed
            ${error ? 'border-clinical-error focus:border-clinical-error focus:ring-clinical-error/20' : 'border-line-strong hover:border-[#B5AEA1]'}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error ? (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-clinical-error pointer-events-none">
            <AlertCircle className="w-5 h-5" />
          </div>
        ) : success ? (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-clinical-success pointer-events-none">
            <Check className="w-5 h-5" />
          </div>
        ) : null}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-[13px] text-clinical-error flex items-center gap-1.5" role="alert">
          <span>{error}</span>
        </p>
      ) : helper ? (
        <p id={`${inputId}-helper`} className="mt-1.5 text-[13px] text-ink-muted">
          {helper}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
