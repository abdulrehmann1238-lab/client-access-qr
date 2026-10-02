import React, { useRef, useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';

interface PasscodeInputProps {
  onComplete: (code: string) => void;
  isVerifying?: boolean;
  isSuccess?: boolean;
  isLocked?: boolean;
  lockoutRemaining?: number;
  errorMessage?: string;
}

export const PasscodeInput: React.FC<PasscodeInputProps> = ({
  onComplete,
  isVerifying = false,
  isSuccess = false,
  isLocked = false,
  lockoutRemaining = 0,
  errorMessage = '',
}) => {
  const [value, setValue] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Trigger shake on error
  useEffect(() => {
    if (errorMessage && !isVerifying && !isSuccess) {
      setIsShaking(true);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(30); } catch (_) {}
      }
      const t = setTimeout(() => {
        setIsShaking(false);
        setValue('');
        inputRef.current?.focus();
      }, 450);
      return () => clearTimeout(t);
    }
  }, [errorMessage, isVerifying, isSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isVerifying || isSuccess || isLocked) return;
    // Keep only letters, convert to uppercase, max length 4
    const cleaned = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4);
    setValue(cleaned);

    if (cleaned.length === 4) {
      setTimeout(() => {
        onComplete(cleaned);
      }, 150);
    }
  };

  const handleCellClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hidden real input capturing all keyboard and paste events */}
      <input
        ref={inputRef}
        type="text"
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck="false"
        maxLength={4}
        value={value}
        onChange={handleChange}
        disabled={isVerifying || isSuccess || isLocked}
        className="opacity-0 absolute -z-10 w-1 h-1 pointer-events-none"
        aria-label="4-letter clinical passcode"
      />

      {/* Visual 4-cell layout */}
      <div
        onClick={handleCellClick}
        className={`flex items-center justify-center gap-3 cursor-pointer select-none transition-opacity duration-200 ${
          isVerifying ? 'opacity-50' : 'opacity-100'
        } ${isShaking ? 'animate-shake' : ''}`}
      >
        {[0, 1, 2, 3].map((index) => {
          const char = value[index] || '';
          const isFocusedCell = value.length === index && !isVerifying && !isSuccess && !isLocked;

          let cellBorder = 'border-line-strong';
          let cellBg = 'bg-surface';
          let textColor = 'text-ink';

          if (isSuccess) {
            cellBorder = 'border-clinical-success';
            cellBg = 'bg-secondary';
            textColor = 'text-primary';
          } else if (errorMessage && isShaking) {
            cellBorder = 'border-clinical-error';
            cellBg = 'bg-surface-raised';
            textColor = 'text-clinical-error';
          } else if (isFocusedCell) {
            cellBorder = 'border-primary ring-2 ring-secondary/80';
          } else if (char) {
            cellBorder = 'border-primary/70';
          }

          return (
            <div
              key={index}
              className={`
                w-[56px] h-[64px] sm:w-[64px] sm:h-[72px] rounded-md border-2
                flex items-center justify-center font-heading text-[28px] sm:text-[32px] font-medium tracking-wider
                transition-all duration-150 shadow-sm
                ${cellBorder} ${cellBg} ${textColor}
              `}
            >
              {char}
              {isFocusedCell && !char && (
                <span className="inline-block w-[2px] h-[26px] bg-primary animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Lock status indicator icon */}
      <div className="mt-4 flex items-center justify-center text-ink-muted transition-colors duration-200">
        {isSuccess ? (
          <div className="flex items-center gap-1.5 text-clinical-success font-medium text-[14px]">
            <Unlock className="w-4 h-4 animate-bounce" />
            <span>Identity verified</span>
          </div>
        ) : isLocked ? (
          <div className="flex items-center gap-1.5 text-clinical-error font-medium text-[14px]">
            <Lock className="w-4 h-4" />
            <span>Temporarily locked ({lockoutRemaining}s)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-ink-muted text-[13px]">
            <Lock className="w-3.5 h-3.5 text-ink-muted" />
            <span>Bank-grade 256-bit client gate</span>
          </div>
        )}
      </div>

      {/* Error / Attempt counter announcement */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-3 px-3 py-2 rounded-md bg-[#FDF2F0] border border-[#F5C2BC] text-clinical-error text-[13px] text-center max-w-[320px]"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
};
