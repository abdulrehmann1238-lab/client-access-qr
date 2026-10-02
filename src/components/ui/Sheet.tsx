import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ink/40 transition-opacity duration-200 animate-fade-in"
      />

      {/* Sheet panel */}
      <div
        ref={sheetRef}
        className="relative w-full max-w-[480px] bg-surface rounded-t-xl shadow-sh-2 z-10 max-h-[85vh] flex flex-col animate-slide-up border-t border-line"
      >
        {/* Grab handle tap area */}
        <div
          onClick={onClose}
          className="w-full pt-3 pb-2 flex justify-center cursor-pointer select-none"
          title="Tap to close"
        >
          <div className="w-10 h-1 rounded-full bg-line-strong hover:bg-ink-muted transition-colors" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-3 pt-1 border-b border-line/60">
          {title ? (
            <h3 className="font-heading text-[19px] font-medium text-ink">
              {title}
            </h3>
          ) : <div />}
          <button
            onClick={onClose}
            className="p-1.5 -mr-1.5 rounded-full text-ink-muted hover:text-ink hover:bg-surface-raised transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scroll text-left">
          {children}
        </div>
      </div>
    </div>
  );
};
