import React, { useState } from 'react';
import { Smartphone, RotateCcw, AlertTriangle, Wifi, QrCode, Clock, ChevronDown, Check } from 'lucide-react';
import { useSimulate } from '../../store/useSimulate';
import { useSession } from '../../store/useSession';

export const SimulateMenu: React.FC = () => {
  const {
    linkState,
    setLinkState,
    deviceFrame,
    setDeviceFrame,
    forceError,
    setForceError,
    slowNetwork,
    setSlowNetwork,
    resetDemo,
  } = useSimulate();

  const { lockPortal } = useSession();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Device Toggle */}
      <div className="inline-flex rounded-lg border border-line-strong/60 bg-surface p-0.5 text-[12px] font-medium shadow-xs">
        <button
          onClick={() => setDeviceFrame('iphone')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
            deviceFrame === 'iphone'
              ? 'bg-primary text-white shadow-xs'
              : 'text-ink-2 hover:text-ink'
          }`}
          title="Simulate iPhone Safari"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>iPhone</span>
        </button>
        <button
          onClick={() => setDeviceFrame('android')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
            deviceFrame === 'android'
              ? 'bg-primary text-white shadow-xs'
              : 'text-ink-2 hover:text-ink'
          }`}
          title="Simulate Android Chrome"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Android</span>
        </button>
      </div>

      {/* QR Link Simulation Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="h-8 px-2.5 rounded-lg border border-line-strong/60 bg-surface hover:bg-surface-raised text-ink text-[12px] font-medium inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <QrCode className="w-3.5 h-3.5 text-primary" />
          <span>QR: {linkState === 'valid' ? 'Valid' : linkState === 'missing' ? 'Missing key' : 'Expired'}</span>
          <ChevronDown className="w-3 h-3 text-ink-muted" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-surface rounded-lg border border-line shadow-sh-2 py-1 z-50 text-[12px]">
            <div className="px-3 py-1 text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
              Simulate QR Scan
            </div>
            {[
              { id: 'valid', label: 'Valid link (?k=qr-7f3a91)' },
              { id: 'missing', label: 'Missing token' },
              { id: 'expired', label: 'Expired token' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setLinkState(opt.id as any);
                  setDropdownOpen(false);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-surface-raised flex items-center justify-between cursor-pointer"
              >
                <span className={linkState === opt.id ? 'font-semibold text-primary' : 'text-ink'}>
                  {opt.label}
                </span>
                {linkState === opt.id && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Force Error Toggle */}
      <button
        onClick={() => setForceError(!forceError)}
        className={`h-8 px-2.5 rounded-lg border text-[12px] font-medium inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors ${
          forceError
            ? 'bg-accent text-white border-accent'
            : 'bg-surface hover:bg-surface-raised border-line-strong/60 text-ink'
        }`}
        title="Simulate submission error & test retry sheets"
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Force Error: {forceError ? 'ON' : 'OFF'}</span>
      </button>

      {/* Slow Network Toggle */}
      <button
        onClick={() => setSlowNetwork(!slowNetwork)}
        className={`h-8 px-2.5 rounded-lg border text-[12px] font-medium inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors ${
          slowNetwork
            ? 'bg-primary text-white border-primary'
            : 'bg-surface hover:bg-surface-raised border-line-strong/60 text-ink'
        }`}
        title="Simulate 3G cellular network latency"
      >
        <Wifi className="w-3.5 h-3.5" />
        <span>Slow Net: {slowNetwork ? '3s' : 'OFF'}</span>
      </button>

      {/* Test Idle Lock */}
      <button
        onClick={() => lockPortal('idle')}
        className="h-8 px-2.5 rounded-lg border border-line-strong/60 bg-surface hover:bg-surface-raised text-ink text-[12px] font-medium inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
        title="Trigger session idle lock immediately"
      >
        <Clock className="w-3.5 h-3.5 text-ink-muted" />
        <span>Test Lock</span>
      </button>

      {/* Reset Demo State */}
      <button
        onClick={resetDemo}
        className="h-8 px-2.5 rounded-lg border border-line-strong/60 bg-surface hover:bg-surface-raised text-clinical-error text-[12px] font-medium inline-flex items-center gap-1 cursor-pointer shadow-xs"
        title="Clear all local data and restore initial prototype state"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Reset</span>
      </button>
    </div>
  );
};
