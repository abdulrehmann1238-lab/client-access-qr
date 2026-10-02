import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, FileText, BookOpen, PhoneCall, Lock, Clock } from 'lucide-react';
import { Tile } from '../components/ui/Tile';
import { BRAND } from '../config/brand';
import { useSession } from '../store/useSession';

export const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { client, logout, lockPortal, idleSecondsRemaining } = useSession();

  // Format idle countdown mm:ss
  const mins = Math.floor(idleSecondsRemaining / 60);
  const secs = idleSecondsRemaining % 60;
  const timeDisplay = `${mins}:${secs.toString().padStart(2, '0')}`;

  const clientFirstName = client ? client.name.split(' ')[0] : 'there';

  return (
    <div className="min-h-full flex flex-col justify-between p-5 max-w-[440px] mx-auto animate-fade-in text-left">
      {/* Sticky Header */}
      <div>
        <header className="sticky top-0 z-10 -mx-5 px-5 py-3 bg-bg/95 backdrop-blur-sm border-b border-line/70 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-primary text-white flex items-center justify-center font-heading text-lg font-bold shadow-sm">
              h
            </div>
            <div>
              <span className="font-heading text-[17px] font-medium text-ink block leading-none">
                Hello, {clientFirstName}
              </span>
              <span className="text-[11px] text-ink-muted">
                {BRAND.name}
              </span>
            </div>
          </div>

          <button
            onClick={() => lockPortal('manual')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium text-ink-2 hover:text-ink hover:bg-surface-raised border border-line transition-colors cursor-pointer"
            title="Lock current session"
          >
            <Lock className="w-3.5 h-3.5 text-ink-muted" />
            <span>Lock</span>
          </button>
        </header>

        {/* Hero Greeting */}
        <div className="mb-5 pt-1">
          <h1 className="font-heading text-[24px] sm:text-[27px] font-medium text-ink leading-tight">
            What do you need today?
          </h1>
          <p className="text-[14px] text-ink-2 mt-1">
            Select an action below or reach our clinical on-call team.
          </p>
        </div>

        {/* 4 Oversized Tiles */}
        <div className="space-y-3">
          <Tile
            icon={<Pill className="w-6 h-6 stroke-[1.8]" />}
            title="Order / Refill Prescription"
            helper="Request a refill in under a minute."
            onClick={() => navigate('/refill')}
            index={0}
          />

          <Tile
            icon={<FileText className="w-6 h-6 stroke-[1.8]" />}
            title="Request Documents"
            helper="Letters, forms and records."
            onClick={() => navigate('/documents')}
            index={1}
          />

          <Tile
            icon={<BookOpen className="w-6 h-6 stroke-[1.8]" />}
            title="Instructions, How-to, Procedures"
            helper="Read-only guides from your care team."
            onClick={() => navigate('/library')}
            index={2}
          />

          <Tile
            icon={<PhoneCall className="w-6 h-6 stroke-[1.8]" />}
            title="Clinical After Hours Support"
            helper="Speak with an on-call clinician."
            isEmphasized={true}
            onClick={() => navigate('/after-hours')}
            index={3}
          />
        </div>
      </div>

      {/* Footer Info & Auto-lock countdown */}
      <div className="pt-8 pb-3 text-center space-y-2">
        <p className="text-[13px] text-ink-2">
          Urgent after-hours question?{' '}
          <button
            onClick={() => navigate('/after-hours')}
            className="text-accent underline font-semibold cursor-pointer"
          >
            Call on-call clinician
          </button>
        </p>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-raised border border-line text-[12px] font-mono text-ink-muted">
          <Clock className="w-3 h-3 text-ink-muted" />
          <span>
            Signed in as {client?.passcode || 'MAPL'} · Auto-locks in {timeDisplay}
          </span>
        </div>
      </div>
    </div>
  );
};
