import React from 'react';
import { Check, Circle, Sparkles, Key, Pill, BookOpen, PhoneCall, Download, ShieldCheck } from 'lucide-react';
import { useSimulate } from '../../store/useSimulate';
import { useSession } from '../../store/useSession';

export const BriefChecklist: React.FC = () => {
  const { checklist } = useSimulate();
  const { setClientDirectly } = useSession();

  const items = [
    {
      id: 'unlockedPasscode',
      label: 'Passcode Gate Unlocked',
      hint: 'Enter street code MAPL (or CEDA/HARB/ELMW)',
      completed: checklist.unlockedPasscode,
      icon: <Key className="w-3.5 h-3.5" />,
      quickAction: () => setClientDirectly('MAPL'),
      actionLabel: 'Quick fill MAPL',
    },
    {
      id: 'submittedForm',
      label: 'Clinical Form Submission',
      hint: 'Submit a refill, document, or after-hours request',
      completed: checklist.submittedForm,
      icon: <Pill className="w-3.5 h-3.5" />,
    },
    {
      id: 'openedPdf',
      label: 'View-Only PDF Library',
      hint: 'Open a procedure guide, notice watermark & deterrents',
      completed: checklist.openedPdf,
      icon: <BookOpen className="w-3.5 h-3.5" />,
    },
    {
      id: 'tappedCall',
      label: 'Tap-to-Call Nursing Trigger',
      hint: 'Fill triage form to activate dial button',
      completed: checklist.tappedCall,
      icon: <PhoneCall className="w-3.5 h-3.5" />,
    },
    {
      id: 'downloadedCsv',
      label: 'Live Sheets & CSV Pipeline',
      hint: 'Download real .csv or watch new row insert',
      completed: checklist.downloadedCsv,
      icon: <Download className="w-3.5 h-3.5" />,
    },
    {
      id: 'testedPrivacy',
      label: 'Data Privacy & Anti-Scraping',
      hint: 'Run visitor scraper test in Security tab',
      completed: checklist.testedPrivacy,
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
  ];

  const completedCount = items.filter((i) => i.completed).length;

  return (
    <div className="flex flex-col h-full bg-surface rounded-xl border border-line shadow-sm p-4 text-left space-y-4">
      <div className="border-b border-line pb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-heading text-[15px] font-medium text-ink flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Interactive Demo Scope</span>
          </span>
          <span className="font-mono text-[12px] font-semibold px-2 py-0.5 rounded bg-secondary text-primary">
            {completedCount}/{items.length}
          </span>
        </div>
        <p className="text-[12px] text-ink-muted">
          Ticks automatically as you test each requirement from the client brief.
        </p>
      </div>

      <div className="space-y-2.5 flex-1 overflow-y-auto custom-scroll">
        {items.map((item) => (
          <div
            key={item.id}
            className={`
              p-3 rounded-lg border transition-all duration-200 text-left
              ${
                item.completed
                  ? 'bg-[#F2F8F5] border-[#CDE5D8]'
                  : 'bg-surface-raised border-line'
              }
            `}
          >
            <div className="flex items-start gap-2.5">
              <div
                className={`
                  w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5 transition-colors
                  ${
                    item.completed
                      ? 'bg-clinical-success text-white'
                      : 'border border-line-strong text-transparent bg-surface'
                  }
                `}
              >
                {item.completed ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Circle className="w-2 h-2" />}
              </div>

              <div className="min-w-0 flex-1">
                <span className={`text-[13px] font-semibold block leading-tight ${item.completed ? 'text-ink' : 'text-ink'}`}>
                  {item.label}
                </span>
                <span className="text-[11px] text-ink-muted mt-0.5 block leading-snug">
                  {item.hint}
                </span>

                {!item.completed && item.quickAction && (
                  <button
                    type="button"
                    onClick={item.quickAction}
                    className="mt-1.5 text-[11px] text-primary hover:underline font-semibold cursor-pointer block"
                  >
                    {item.actionLabel} →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-line text-[11px] text-ink-muted flex items-center justify-between">
        <span>Harbourline Prototype</span>
        <span className="font-mono">Figma Prep</span>
      </div>
    </div>
  );
};
