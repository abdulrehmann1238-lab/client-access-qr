import React from 'react';
import { Lock, PhoneCall, RefreshCw } from 'lucide-react';
import { BRAND } from '../config/brand';
import { useSimulate } from '../store/useSimulate';

export const InactiveLink: React.FC = () => {
  const { setLinkState } = useSimulate();

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-surface-raised border border-line flex items-center justify-center mb-6 text-ink-muted">
        <Lock className="w-8 h-8 stroke-[1.75]" />
      </div>

      <h2 className="font-heading text-[24px] sm:text-[26px] font-medium text-ink mb-3">
        This link isn't active
      </h2>

      <p className="text-[15px] text-ink-2 max-w-[320px] leading-relaxed mb-6">
        Please scan the QR code on your clinic magnet or bedside folder, or contact your care team.
      </p>

      <div className="w-full max-w-[320px] space-y-3">
        <a
          href={BRAND.phoneRaw}
          className="w-full min-h-[52px] h-[52px] rounded-md bg-surface border border-line-strong hover:border-primary text-ink font-medium inline-flex items-center justify-center gap-2 transition-colors"
        >
          <PhoneCall className="w-4 h-4 text-primary" />
          <span>Call the office: {BRAND.phone}</span>
        </a>

        {/* Demo shell helper button */}
        <button
          onClick={() => setLinkState('valid')}
          className="w-full text-[13px] text-primary hover:underline flex items-center justify-center gap-1.5 py-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Simulate valid QR scan (k=qr-7f3a91)</span>
        </button>
      </div>

      <div className="mt-12 text-[12px] text-ink-muted flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5" />
        <span>Harbourline Secure Gateway · Zero-leakage entry</span>
      </div>
    </div>
  );
};
