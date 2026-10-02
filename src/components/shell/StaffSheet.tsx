import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle2, Clock, Filter, Table } from 'lucide-react';
import { useRequests, ClinicalRequest } from '../../store/useRequests';
import { useSimulate } from '../../store/useSimulate';

export const StaffSheet: React.FC = () => {
  const {
    requests,
    syncMode,
    setSyncMode,
    filterType,
    setFilterType,
    runHourlySync,
    exportCsvBlob,
  } = useRequests();

  const { markChecklist } = useSimulate();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const filteredRequests = requests.filter((r) => {
    if (filterType === 'All') return true;
    return r.type === filterType;
  });

  const pendingCount = requests.filter((r) => !r.synced).length;

  const handleDownloadCsv = () => {
    const blob = exportCsvBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `harbourline_clinical_requests_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    markChecklist('downloadedCsv');
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-surface rounded-xl border border-line shadow-sm overflow-hidden text-left">
      {/* Top Controls Bar */}
      <div className="p-3.5 bg-surface-raised border-b border-line flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-clinical-success animate-pulse shrink-0" />
          <span className="font-heading text-[15px] font-medium text-ink">
            Staff View · Live Sync
          </span>
          <span className="text-[12px] font-mono px-2 py-0.5 rounded bg-surface border border-line text-ink-muted">
            {requests.length} rows
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Real-time vs Hourly sync toggle */}
          <div className="inline-flex rounded-md border border-line bg-surface p-0.5 text-[12px] font-medium">
            <button
              onClick={() => setSyncMode('realtime')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                syncMode === 'realtime'
                  ? 'bg-primary text-white'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              Real-time
            </button>
            <button
              onClick={() => setSyncMode('hourly')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                syncMode === 'hourly'
                  ? 'bg-primary text-white'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              Hourly
            </button>
          </div>

          {/* If hourly and items pending, show flush button */}
          {syncMode === 'hourly' && pendingCount > 0 && (
            <button
              onClick={runHourlySync}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#EAF2ED] text-primary hover:bg-[#DCEAE1] border border-[#CBDDD2] text-[12px] font-medium transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync ({pendingCount})</span>
            </button>
          )}

          {/* Download real CSV button */}
          <button
            onClick={handleDownloadCsv}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium border transition-all cursor-pointer shadow-sm
              ${
                downloadSuccess
                  ? 'bg-clinical-success text-white border-clinical-success'
                  : 'bg-surface hover:bg-surface-raised border-line-strong text-ink'
              }
            `}
            title="Download full dataset as .csv file"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>Download CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3.5 py-2 bg-surface border-b border-line flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-ink-muted shrink-0 mr-1" />
          {(['All', 'Refill', 'Documents', 'After hours'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-2 py-0.5 rounded text-[12px] font-medium transition-colors cursor-pointer ${
                filterType === cat
                  ? 'bg-secondary text-primary font-semibold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-[11px] font-mono text-ink-muted hidden sm:inline">
          Sheets/CSV Pipeline (Milestone 3)
        </span>
      </div>

      {/* Spreadsheet Grid Container */}
      <div className="flex-1 overflow-auto custom-scroll relative">
        <table className="w-full text-left border-collapse text-[13px] font-sans">
          {/* Frozen Table Header */}
          <thead className="sticky top-0 z-10 bg-[#FAF8F5] border-b border-line shadow-xs">
            <tr className="text-ink-muted text-[11px] font-mono uppercase tracking-wider">
              <th className="py-2.5 px-3 w-10 text-center font-normal border-r border-line/60">#</th>
              <th className="py-2.5 px-3 font-medium border-r border-line/60">Timestamp</th>
              <th className="py-2.5 px-3 font-medium border-r border-line/60">Reference</th>
              <th className="py-2.5 px-3 font-medium border-r border-line/60">Client</th>
              <th className="py-2.5 px-3 font-medium border-r border-line/60">Type</th>
              <th className="py-2.5 px-3 font-medium border-r border-line/60 min-w-[200px]">Details</th>
              <th className="py-2.5 px-3 font-medium border-r border-line/60">Urgency</th>
              <th className="py-2.5 px-3 font-medium border-r border-line/60">Status</th>
              <th className="py-2.5 px-3 font-medium">Pipeline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 bg-surface">
            {filteredRequests.map((row, idx) => {
              const isUrgent = row.urgency === 'Urgent';
              const isAfterHours = row.type === 'After hours';

              return (
                <tr
                  key={row.id}
                  className={`
                    hover:bg-[#FAF8F5] transition-colors
                    ${row.isNewArrival ? 'animate-row-insert' : ''}
                  `}
                >
                  <td className="py-2.5 px-3 text-center font-mono text-[11px] text-ink-muted border-r border-line/60 bg-surface-raised/40">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[12px] text-ink-2 whitespace-nowrap border-r border-line/60">
                    {row.timestamp}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium text-primary whitespace-nowrap border-r border-line/60">
                    {row.ref}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap border-r border-line/60">
                    <span className="font-semibold text-ink">{row.client}</span>
                    <span className="text-ink-muted text-[11px] ml-1">({row.clientName})</span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap border-r border-line/60">
                    <span
                      className={`
                        inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium
                        ${
                          row.type === 'Refill'
                            ? 'bg-[#EBF3EF] text-primary'
                            : row.type === 'Documents'
                            ? 'bg-[#EBF0F6] text-[#2F5F8A]'
                            : 'bg-accent-soft text-accent'
                        }
                      `}
                    >
                      {row.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-ink-2 text-[12px] border-r border-line/60 leading-snug">
                    {row.details}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap border-r border-line/60">
                    <span
                      className={`text-[12px] font-medium ${
                        isUrgent
                          ? 'text-accent font-semibold'
                          : row.urgency === 'Needs attention soon'
                          ? 'text-[#B06B1A]'
                          : 'text-ink-muted'
                      }`}
                    >
                      {row.urgency}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap border-r border-line/60">
                    <span className="text-[12px] font-medium text-ink">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px]">
                    {row.synced ? (
                      <span className="text-clinical-success flex items-center gap-1 font-medium">
                        <span>✓</span>
                        <span>{row.syncedTime || 'Synced'}</span>
                      </span>
                    ) : (
                      <span className="text-[#B06B1A] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Queued</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer reassurance */}
      <div className="p-2.5 bg-surface-raised border-t border-line text-[11px] text-ink-muted flex items-center justify-between">
        <span>Google Sheet / CSV pipeline simulation · Synced via backend webhook</span>
        <span className="font-mono">Bubble Data API</span>
      </div>
    </div>
  );
};
