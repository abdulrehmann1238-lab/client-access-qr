import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'error';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  const icons = {
    info: <Info className="w-5 h-5 text-clinical-info shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-clinical-success shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-clinical-error shrink-0" />,
  };

  const bgStyles = {
    info: 'bg-surface border-line text-ink',
    success: 'bg-[#F2F8F5] border-[#CDE5D8] text-ink',
    error: 'bg-[#FDF2F0] border-[#F5C2BC] text-ink',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] w-[calc(100%-32px)] max-w-[390px] px-4 py-3 rounded-md shadow-sh-2 border flex items-center justify-between gap-3 animate-slide-up bg-surface"
    >
      <div className="flex items-center gap-2.5 text-[14px] leading-snug">
        {icons[toast.type]}
        <span>{toast.message}</span>
      </div>
      <button
        onClick={onDismiss}
        className="text-ink-muted hover:text-ink p-1 rounded transition-colors"
        aria-label="Dismiss message"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
