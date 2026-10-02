import React from 'react';
import { Loader2, Check } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'call';
  isLoading?: boolean;
  isSuccess?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  isSuccess = false,
  fullWidth = true,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseClasses = "relative inline-flex items-center justify-center font-semibold rounded-md min-h-[52px] h-[56px] px-6 text-[17px] transition-all duration-150 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-focus focus-visible:ring-offset-2 active:scale-[0.985]";

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-active disabled:bg-line-strong disabled:text-ink-muted disabled:cursor-not-allowed disabled:active:scale-100",
    secondary: "bg-secondary text-primary hover:bg-[#CFDDD5] active:bg-[#BFCFC6] border border-[#CBD7D0] disabled:opacity-50 disabled:cursor-not-allowed",
    ghost: "bg-transparent text-ink-2 hover:bg-surface-raised active:bg-line border border-transparent disabled:opacity-40",
    danger: "bg-clinical-error text-white hover:bg-[#972E24] active:bg-[#7D241C] disabled:opacity-50",
    call: "bg-accent text-white hover:bg-[#A34724] active:bg-[#8D3B1C] shadow-sm disabled:bg-[#D5C2BA] disabled:text-[#8D7F7A] disabled:cursor-not-allowed disabled:active:scale-100"
  };

  return (
    <button
      disabled={disabled || isLoading || isSuccess}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </span>
      ) : isSuccess ? (
        <span className="flex items-center gap-2 text-white">
          <Check className="w-5 h-5" />
          <span>Confirmed</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
