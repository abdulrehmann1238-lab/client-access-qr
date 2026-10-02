import React from 'react';
import { ShieldAlert, BookOpen } from 'lucide-react';
import { BRAND } from '../../config/brand';

interface PageContent {
  pageNumber: number;
  title: string;
  section: string;
  content: string[];
  callout?: string;
}

interface PdfPageProps {
  page: PageContent;
  totalPages: number;
  clientWatermark: string;
  onSecurityNotice: () => void;
}

export const PdfPage: React.FC<PdfPageProps> = ({
  page,
  totalPages,
  clientWatermark,
  onSecurityNotice,
}) => {
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        onSecurityNotice();
      }}
      className="relative w-full bg-surface rounded-lg border border-line shadow-sh-1 p-6 sm:p-8 min-h-[500px] flex flex-col justify-between unselectable overflow-hidden select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Repeating diagonal subtle watermark */}
      <div
        className="absolute inset-0 pointer-events-none flex flex-col justify-around rotate-[-25deg] scale-125 opacity-[0.06] select-none"
        aria-hidden="true"
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="text-[20px] font-mono whitespace-nowrap text-ink tracking-widest text-center">
            {clientWatermark} · HARBOURLINE CLINICAL · VIEW-ONLY PROTECTED
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className="relative z-10 border-b border-line pb-3.5 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-secondary text-primary flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-ink-muted">
            {BRAND.name}
          </span>
        </div>
        <span className="text-[12px] font-mono text-ink-muted">
          Page {page.pageNumber} of {totalPages}
        </span>
      </div>

      {/* Page Body */}
      <div className="relative z-10 space-y-4 text-left">
        <div>
          <span className="text-[12px] font-semibold uppercase tracking-wider text-primary">
            {page.section}
          </span>
          <h2 className="font-heading text-[20px] sm:text-[22px] font-medium text-ink mt-0.5 leading-snug">
            {page.title}
          </h2>
        </div>

        <div className="space-y-3 pt-2">
          {page.content.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-surface-raised border border-line text-[11px] font-mono font-medium text-ink-2 shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-[14px] leading-relaxed text-ink-2">
                {item}
              </p>
            </div>
          ))}
        </div>

        {page.callout && (
          <div className="mt-5 p-3.5 rounded-md bg-[#FAF4ED] border border-[#ECD9C8] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <p className="text-[13px] leading-snug text-ink font-medium">
              {page.callout}
            </p>
          </div>
        )}
      </div>

      {/* Page Footer */}
      <div className="relative z-10 border-t border-line pt-3 mt-6 flex items-center justify-between text-[11px] text-ink-muted font-mono">
        <span>CONFIDENTIAL CLINICAL PROTOCOL</span>
        <span>NO REPRODUCTION WITHOUT AUTHORIZATION</span>
      </div>
    </div>
  );
};
