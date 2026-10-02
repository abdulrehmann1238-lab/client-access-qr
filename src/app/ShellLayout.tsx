import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Table, Shield, Layers, HelpCircle, X, ExternalLink, Sparkles } from 'lucide-react';
import { PhoneFrame } from '../components/shell/PhoneFrame';
import { StaffSheet } from '../components/shell/StaffSheet';
import { SecurityPanel } from '../components/shell/SecurityPanel';
import { DeliveryPlan } from '../components/shell/DeliveryPlan';
import { BriefChecklist } from '../components/shell/BriefChecklist';
import { SimulateMenu } from '../components/shell/SimulateMenu';
import { Sheet } from '../components/ui/Sheet';
import { BRAND } from '../config/brand';
import { useSimulate } from '../store/useSimulate';
import { useSession } from '../store/useSession';

export const ShellLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { activeShellTab, setActiveShellTab, linkState } = useSimulate();
  const {
    isAuthenticated,
    isLocked,
    tickIdle,
    resetIdle,
  } = useSession();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Global user activity tracking for idle timer
  useEffect(() => {
    const handleUserActivity = () => {
      resetIdle();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    const idleInterval = setInterval(() => {
      tickIdle();
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      clearInterval(idleInterval);
    };
  }, [tickIdle, resetIdle]);

  // Route session guard: if not authenticated and trying to access internal routes, redirect to root
  useEffect(() => {
    if (location.pathname !== '/' && (!isAuthenticated || isLocked)) {
      navigate('/', { replace: true });
    }
  }, [location.pathname, isAuthenticated, isLocked, navigate]);

  return (
    <div className="min-h-screen bg-shell-bg text-shell-ink flex flex-col font-sans select-text">
      {/* Top Shell Bar for Desktop / Laptop */}
      <header className="hidden lg:flex h-14 bg-surface border-b border-line px-6 items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-primary text-white flex items-center justify-center font-heading font-bold text-sm">
            h
          </div>
          <div>
            <span className="font-heading text-[15px] font-medium text-ink block leading-none">
              {BRAND.name}
            </span>
            <span className="text-[11px] text-ink-muted">
              Interactive Prototype · QR-Access Clinical Portal
            </span>
          </div>
        </div>

        {/* Interactive Simulation Controls */}
        <SimulateMenu />
      </header>

      {/* Main Presentation Stage */}
      <main className="flex-1 flex justify-center items-center p-0 lg:p-6 overflow-hidden">
        <div className="w-full max-w-[1600px] h-full flex flex-col lg:flex-row items-center justify-center gap-6">
          
          {/* Left Column (Desktop Only): Brief Checklist */}
          <aside className="hidden xl:block w-[300px] 2xl:w-[320px] h-[844px] shrink-0">
            <BriefChecklist />
          </aside>

          {/* Center Column: Phone Viewport (Interactive Mobile Product) */}
          <div className="w-full lg:w-[410px] flex justify-center shrink-0">
            <PhoneFrame>
              <Outlet />
            </PhoneFrame>
          </div>

          {/* Right Column (Desktop Only): Tabbed Staff & Proposal Panels */}
          <aside className="hidden lg:flex flex-col w-[420px] xl:w-[480px] 2xl:w-[540px] h-[844px] shrink-0">
            {/* Panel Tabs Header */}
            <div className="flex gap-1.5 p-1 bg-[#E2DCCE] rounded-t-xl border-t border-x border-line">
              {[
                { id: 'sheet', label: 'Staff Sheet (Live Sync)', icon: <Table className="w-3.5 h-3.5" /> },
                { id: 'security', label: 'Security & Privacy', icon: <Shield className="w-3.5 h-3.5" /> },
                { id: 'delivery', label: 'Delivery Plan', icon: <Layers className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveShellTab(tab.id as any)}
                  className={`
                    flex-1 py-2 px-3 rounded-lg text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer
                    ${
                      activeShellTab === tab.id
                        ? 'bg-surface text-ink shadow-xs font-semibold'
                        : 'text-ink-2 hover:bg-surface/50'
                    }
                  `}
                >
                  {tab.icon}
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Active Panel Body */}
            <div className="flex-1 min-h-0">
              {activeShellTab === 'sheet' && <StaffSheet />}
              {activeShellTab === 'security' && <SecurityPanel />}
              {activeShellTab === 'delivery' && <DeliveryPlan />}
            </div>
          </aside>
        </div>
      </main>

      {/* Footer Disclaimer (Desktop) */}
      <footer className="hidden lg:flex h-9 bg-surface/80 border-t border-line px-6 items-center justify-between text-[11px] text-ink-muted shrink-0">
        <span>{BRAND.placeholderNotice}</span>
        <div className="flex items-center gap-3">
          <span>Client brief QA verified</span>
          <span>•</span>
          <span>Ready for Figma sync (Milestone 2)</span>
        </div>
      </footer>

      {/* Mobile Floating "Behind the scenes" button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="px-3.5 py-2.5 rounded-full bg-primary text-white shadow-lg flex items-center gap-2 text-[13px] font-semibold cursor-pointer border border-white/20 active:scale-95 transition-transform"
        >
          <Sparkles className="w-4 h-4 text-secondary" />
          <span>Behind the scenes</span>
        </button>
      </div>

      {/* Mobile / Tablet Drawer containing the 3 Shell Panels */}
      <Sheet
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        title="Behind the Scenes (Staff & Architecture)"
      >
        <div className="space-y-4">
          {/* Quick Simulation controls inside drawer */}
          <div className="p-3 bg-surface-raised rounded-lg border border-line">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-ink-muted block mb-2">
              Demo Simulation Controls
            </span>
            <SimulateMenu />
          </div>

          {/* Drawer tab navigation */}
          <div className="flex gap-1 p-1 bg-surface-raised rounded-lg border border-line text-[12px]">
            <button
              onClick={() => setActiveShellTab('sheet')}
              className={`flex-1 py-1.5 rounded-md font-medium ${
                activeShellTab === 'sheet' ? 'bg-primary text-white' : 'text-ink-2'
              }`}
            >
              Staff Sheet
            </button>
            <button
              onClick={() => setActiveShellTab('security')}
              className={`flex-1 py-1.5 rounded-md font-medium ${
                activeShellTab === 'security' ? 'bg-primary text-white' : 'text-ink-2'
              }`}
            >
              Security & SEO
            </button>
            <button
              onClick={() => setActiveShellTab('delivery')}
              className={`flex-1 py-1.5 rounded-md font-medium ${
                activeShellTab === 'delivery' ? 'bg-primary text-white' : 'text-ink-2'
              }`}
            >
              Delivery Plan
            </button>
          </div>

          <div className="min-h-[360px] max-h-[60vh] overflow-y-auto">
            {activeShellTab === 'sheet' && <StaffSheet />}
            {activeShellTab === 'security' && <SecurityPanel />}
            {activeShellTab === 'delivery' && <DeliveryPlan />}
          </div>
        </div>
      </Sheet>
    </div>
  );
};
