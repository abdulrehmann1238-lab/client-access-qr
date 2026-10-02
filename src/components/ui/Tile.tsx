import React from 'react';
import { ChevronRight } from 'lucide-react';

interface TileProps {
  icon: React.ReactNode;
  title: string;
  helper: string;
  isEmphasized?: boolean;
  onClick: () => void;
  index?: number;
}

export const Tile: React.FC<TileProps> = ({
  icon,
  title,
  helper,
  isEmphasized = false,
  onClick,
  index = 0,
}) => {
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${index * 60}ms` }}
      className={`
        w-full min-h-[96px] p-4 rounded-lg bg-surface border transition-all duration-200 cursor-pointer
        text-left flex items-center justify-between gap-3.5 group select-none
        hover:border-line-strong active:scale-[0.99] active:bg-surface-raised
        focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-focus
        animate-slide-up
        ${isEmphasized ? 'border-l-[3.5px] border-l-accent border-line' : 'border-line'}
      `}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={`
            w-12 h-12 rounded-md shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105
            ${isEmphasized ? 'bg-accent-soft text-accent' : 'bg-secondary text-primary'}
          `}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-heading text-[17px] sm:text-[18px] font-medium text-ink leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-[13px] text-ink-2 mt-0.5 leading-snug line-clamp-2">
            {helper}
          </p>
        </div>
      </div>

      <div className="text-ink-muted group-hover:text-primary group-hover:translate-x-1 transition-all duration-150 shrink-0">
        <ChevronRight className="w-5 h-5" />
      </div>
    </button>
  );
};
