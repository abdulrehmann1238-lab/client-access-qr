import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { BRAND } from '../../config/brand';

interface BrandLoaderProps {
  onComplete: () => void;
}

export const BrandLoader: React.FC<BrandLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(20);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Check if previously loaded in this session
    const hasLoaded = sessionStorage.getItem('harbourline_loader_shown');
    if (hasLoaded) {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setProgress(45), 200); // fonts ready
    const t2 = setTimeout(() => setProgress(75), 450); // route chunks
    const t3 = setTimeout(() => setProgress(100), 750); // mock data seeded

    const t4 = setTimeout(() => {
      setIsExiting(true);
      sessionStorage.setItem('harbourline_loader_shown', 'true');
      setTimeout(onComplete, 450);
    }, 950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      className={`
        fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center select-none transition-transform duration-500 ease-in-out
        ${isExiting ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}
      `}
    >
      <div className="flex flex-col items-center max-w-[280px] text-center">
        {/* Monogram with rise & fade */}
        <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-heading text-2xl font-bold shadow-sm mb-4 animate-slide-up">
          h
        </div>

        {/* Wordmark */}
        <div className="overflow-hidden">
          <h1 className="font-heading text-[26px] font-medium text-ink tracking-tight">
            {BRAND.shortName}
          </h1>
        </div>

        {/* Eyebrow descriptor */}
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-2 mt-1">
          <Lock className="w-3 h-3 text-primary" />
          <span>{BRAND.tagline}</span>
        </div>

        {/* Hairline 2px progress bar */}
        <div className="w-40 h-[2px] bg-line rounded-full overflow-hidden mt-6">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[11px] font-mono text-ink-muted mt-2">
          Initializing clinical vault…
        </span>
      </div>
    </div>
  );
};
