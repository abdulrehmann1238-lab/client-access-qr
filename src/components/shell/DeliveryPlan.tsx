import React from 'react';
import { CheckCircle2, ArrowUpRight, Calendar, Layers, ShieldCheck, Database, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSimulate } from '../../store/useSimulate';

export const DeliveryPlan: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveShellTab } = useSimulate();

  const milestones = [
    {
      id: 1,
      badge: '25%',
      title: 'Database, Passcode Auth & Security Lockdown',
      icon: <Database className="w-4 h-4 text-primary" />,
      bullets: [
        'Client & prescription data structures in Bubble Data Types',
        '4-letter street-name passcode logic with 5-attempt rate-limiting and lockout',
        'SEO lockdown (noindex, robots.txt) and strict Data Privacy Rules preventing scraper access',
      ],
      demoLink: 'Inspect Security panel',
      action: () => setActiveShellTab('security'),
    },
    {
      id: 2,
      badge: '25%',
      title: 'Pixel-Faithful UI Build & Navigation',
      icon: <Smartphone className="w-4 h-4 text-primary" />,
      bullets: [
        'Direct 1:1 match to your approved Figma file and brand assets',
        'Mobile-first responsive styling optimized for one-handed night use',
        'View-only protected PDF reader with canvas pages and dynamic watermarking',
      ],
      demoLink: 'View clinical guides',
      action: () => navigate('/library'),
    },
    {
      id: 3,
      badge: '25%',
      title: 'Clinical Forms, Sheets/CSV Pipeline & Tap-to-Call',
      icon: <Layers className="w-4 h-4 text-primary" />,
      bullets: [
        '3 validated clinical workflows: Refill (3 steps), Request Documents, After-Hours Triage',
        'Automated Google Sheets webhook sync with downloadable CSV dispatch backup',
        'Conditional "Tap to Call" phone trigger with safety-first clinical failover',
      ],
      demoLink: 'View Live Staff Sheet',
      action: () => setActiveShellTab('sheet'),
    },
    {
      id: 4,
      badge: '25%',
      title: 'Mobile QA, Cross-Device Polish & App Transfer',
      icon: <ShieldCheck className="w-4 h-4 text-primary" />,
      bullets: [
        'Thorough QA across physical iPhone Safari & Android Chrome (safe areas, 100dvh, no input zoom)',
        'Lighthouse verification: Performance ≥ 90, Accessibility ≥ 95',
        'Bubble application transfer, backend workflow audit, and admin video walkthrough',
      ],
      demoLink: 'Test phone frame switch',
      action: () => navigate('/menu'),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-surface rounded-xl border border-line shadow-sm overflow-y-auto custom-scroll p-4 sm:p-5 text-left space-y-4">
      {/* Header */}
      <div className="border-b border-line pb-3.5 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-[16px] font-medium text-ink">
            Project Delivery Roadmap
          </h3>
          <span className="text-[12px] text-ink-muted">
            Structured into 4 equal 25% milestone releases mapped to your requirements
          </span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-secondary text-primary font-mono text-[12px] font-semibold">
          4 Milestones
        </div>
      </div>

      {/* Milestone Cards */}
      <div className="space-y-3">
        {milestones.map((m) => (
          <div
            key={m.id}
            className="p-4 rounded-lg bg-surface-raised border border-line hover:border-line-strong transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-mono text-[12px] font-semibold">
                  M{m.id}
                </span>
                <span className="font-heading text-[14px] sm:text-[15px] font-medium text-ink">
                  {m.title}
                </span>
              </div>
              <span className="font-mono text-[12px] font-semibold text-primary px-2 py-0.5 rounded bg-surface border border-line">
                {m.badge}
              </span>
            </div>

            <ul className="space-y-1.5 pl-1">
              {m.bullets.map((b, i) => (
                <li key={i} className="text-[12px] text-ink-2 flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="pt-1 flex items-center justify-between border-t border-line/60">
              <div className="w-24 h-1.5 rounded-full bg-line overflow-hidden">
                <div className="w-full h-full bg-clinical-success" />
              </div>
              <button
                type="button"
                onClick={m.action}
                className="text-[12px] text-primary hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{m.demoLink}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-lg bg-[#FAF4ED] border border-[#ECD9C8] text-[12px] text-ink-2">
        <strong>Figma Fidelity Guarantee:</strong> The demo presents a quiet, restrained interpretation. In Milestone 2, every card radius, spacing token, and font hierarchy will be matched 100% to your Figma design file.
      </div>
    </div>
  );
};
