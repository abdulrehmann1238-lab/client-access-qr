import React, { useState } from 'react';
import { Shield, Copy, Check, Terminal, Lock, Eye, AlertCircle, FileCode } from 'lucide-react';
import { useSimulate } from '../../store/useSimulate';
import { useSession } from '../../store/useSession';
import clientsData from '../../data/clients.json';

export const SecurityPanel: React.FC = () => {
  const { markChecklist } = useSimulate();
  const { client } = useSession();

  const [copiedRobots, setCopiedRobots] = useState(false);
  const [copiedMeta, setCopiedMeta] = useState(false);
  const [inspectorMode, setInspectorMode] = useState<'visitor' | 'authenticated'>('visitor');

  const robotsText = `User-agent: *\nDisallow: /\n# No clinical portal indexing permitted`;
  const metaTag = `<meta name="robots" content="noindex, nofollow" />`;

  const copyText = (text: string, type: 'robots' | 'meta') => {
    navigator.clipboard.writeText(text);
    if (type === 'robots') {
      setCopiedRobots(true);
      setTimeout(() => setCopiedRobots(false), 2000);
    } else {
      setCopiedMeta(true);
      setTimeout(() => setCopiedMeta(false), 2000);
    }
  };

  const handleRunInspector = (mode: 'visitor' | 'authenticated') => {
    setInspectorMode(mode);
    markChecklist('testedPrivacy');
  };

  return (
    <div className="flex flex-col h-full bg-surface rounded-xl border border-line shadow-sm overflow-y-auto custom-scroll p-4 sm:p-5 text-left space-y-5">
      {/* Header */}
      <div className="border-b border-line pb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-secondary text-primary flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-[16px] font-medium text-ink">
              Security & Privacy Architecture
            </h3>
            <span className="text-[12px] text-ink-muted">
              Milestone 1 Deliverables · Zero search indexing & strict data rules
            </span>
          </div>
        </div>
      </div>

      {/* SEO & Search Engine Lockdown Card */}
      <div className="p-4 rounded-lg bg-surface-raised border border-line space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-ink flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>SEO Shield (Noindex + robots.txt)</span>
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface border border-line text-clinical-success font-medium">
            Active in &lt;head&gt;
          </span>
        </div>

        <div className="space-y-2">
          <div className="relative bg-[#1E2623] text-[#DCE7E1] font-mono text-[12px] p-3 rounded-md overflow-x-auto">
            <code>{metaTag}</code>
            <button
              onClick={() => copyText(metaTag, 'meta')}
              className="absolute right-2 top-2 p-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Copy meta tag"
            >
              {copiedMeta ? <Check className="w-3.5 h-3.5 text-clinical-success" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="relative bg-[#1E2623] text-[#DCE7E1] font-mono text-[12px] p-3 rounded-md overflow-x-auto whitespace-pre">
            <code>{robotsText}</code>
            <button
              onClick={() => copyText(robotsText, 'robots')}
              className="absolute right-2 top-2 p-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Copy robots.txt"
            >
              {copiedRobots ? <Check className="w-3.5 h-3.5 text-clinical-success" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
        <p className="text-[12px] text-ink-2">
          Prevents Google, Bing, and crawlers from archiving client portal URLs, patient submission endpoints, or clinical procedure assets.
        </p>
      </div>

      {/* Secret Link Model */}
      <div className="p-4 rounded-lg bg-surface-raised border border-line space-y-2">
        <span className="text-[13px] font-semibold text-ink flex items-center gap-1.5">
          <FileCode className="w-3.5 h-3.5 text-primary" />
          <span>Secret QR Token Access (A4)</span>
        </span>
        <p className="text-[13px] text-ink-2 leading-relaxed">
          Physical magnets link directly to <code className="font-mono bg-surface px-1.5 py-0.5 rounded border border-line text-primary">/?k=qr-7f3a91</code>. Requests missing this parameter render a generic "This link isn't active" view with zero client or clinic branding, eliminating URL enumeration attacks.
        </p>
      </div>

      {/* Bubble Data Privacy Rules & Anti-Scraping Sandbox */}
      <div className="p-4 rounded-lg bg-surface-raised border border-line space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-ink flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-primary" />
            <span>Data Privacy Rules Inspection</span>
          </span>
          <span className="text-[11px] font-mono text-ink-muted">Simulated Bubble Engine</span>
        </div>

        <p className="text-[12px] text-ink-2">
          Test what an unauthenticated browser scraper retrieves versus an authenticated client session:
        </p>

        {/* Toggle buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleRunInspector('visitor')}
            className={`flex-1 py-1.5 px-3 rounded-md text-[12px] font-medium border transition-colors cursor-pointer ${
              inspectorMode === 'visitor'
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-ink-2 border-line hover:border-primary/60'
            }`}
          >
            Inspect as Anonymous Visitor
          </button>
          <button
            onClick={() => handleRunInspector('authenticated')}
            className={`flex-1 py-1.5 px-3 rounded-md text-[12px] font-medium border transition-colors cursor-pointer ${
              inspectorMode === 'authenticated'
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-ink-2 border-line hover:border-primary/60'
            }`}
          >
            Inspect as {client ? client.passcode : 'MAPL'} Session
          </button>
        </div>

        {/* Terminal output */}
        <div className="bg-[#19211E] text-[#D4E2DC] font-mono text-[12px] p-3 rounded-md space-y-1.5 border border-line-strong/30">
          <div className="flex items-center gap-1.5 text-ink-muted text-[11px] pb-1 border-b border-white/10">
            <Terminal className="w-3.5 h-3.5" />
            <span>HTTP Sandbox Inspector (simulated)</span>
          </div>

          {inspectorMode === 'visitor' ? (
            <div className="space-y-1 text-[11px]">
              <p className="text-[#E57373]">❯ GET /api/1.1/obj/client_profiles</p>
              <p className="text-[#EF9A9A]">403 Forbidden: Privacy Rule "Public Deny All" enforced.</p>
              <p className="text-[#E57373]">❯ GET /api/1.1/obj/prescription_records</p>
              <p className="text-white/60">Response: [] (0 rows leaked to browser inspection)</p>
            </div>
          ) : (
            <div className="space-y-1 text-[11px]">
              <p className="text-[#81C784]">❯ GET /api/1.1/obj/client_profiles</p>
              <p className="text-white/90">200 OK: Match Client Code "{client ? client.passcode : 'MAPL'}"</p>
              <p className="text-[#81C784]">❯ GET /api/1.1/obj/prescription_records</p>
              <p className="text-[#A5D6A7]">
                Returned 4 active items bound to current session.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Honest note on PDF protection */}
      <div className="p-3.5 rounded-lg bg-[#FAF4ED] border border-[#ECD9C8] flex items-start gap-2.5 text-[12px] text-ink-2">
        <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-accent block">Client Honesty Note (A6):</strong>
          <span>
            True client-side download blocking does not exist in standard web browsers. Our implementation applies industry best-practice deterrents: non-downloadable canvas renders, disabled context menus, unselectable text, and dynamic watermark tracking.
          </span>
        </div>
      </div>
    </div>
  );
};
