import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, ZoomIn } from 'lucide-react';
import { PdfPage } from '../components/product/PdfPage';
import { Toast, ToastMessage } from '../components/ui/Toast';
import { useSession } from '../store/useSession';
import { mockApi } from '../mock/api';

export const PdfViewer: React.FC = () => {
  const { docId } = useParams<{ docId: string }>();
  const navigate = useNavigate();
  const { client } = useSession();

  const [guide, setGuide] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    if (docId) {
      mockApi.getGuideById(docId).then((data) => {
        setGuide(data);
        setLoading(false);
      });
    }
  }, [docId]);

  const showSecurityToast = () => {
    setToast({
      id: String(Date.now()),
      type: 'info',
      message: 'These clinical guides are view-only. Downloading and copy actions are restricted.',
    });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const clientWatermark = client ? `${client.name} (${client.passcode})` : 'Harbourline Clinical Care';

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-[13px] text-ink-muted font-mono">Opening protected document...</p>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-heading text-[22px] font-medium text-ink mb-2">
          This guide can't be displayed right now
        </h2>
        <p className="text-[14px] text-ink-2 mb-6">
          The requested document could not be located in our clinical library.
        </p>
        <button
          onClick={() => navigate('/library')}
          className="text-primary underline font-medium text-[15px]"
        >
          Return to library
        </button>
      </div>
    );
  }

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        showSecurityToast();
      }}
      className="min-h-full flex flex-col bg-[#EFECE6] unselectable"
    >
      {/* Toast alert */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-20 px-4 py-3 bg-surface/95 backdrop-blur border-b border-line flex items-center justify-between shadow-sm">
        <button
          onClick={() => navigate('/library')}
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink hover:text-primary transition-colors cursor-pointer py-1"
          aria-label="Back to guide list"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Guides</span>
        </button>

        <div className="text-center px-2 min-w-0 max-w-[200px] sm:max-w-[240px]">
          <h1 className="font-heading text-[15px] font-medium text-ink truncate leading-tight">
            {guide.title}
          </h1>
          <span className="text-[11px] font-mono text-ink-muted">
            {guide.pages.length} Pages · View Only
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-ink-muted" title="Download & printing disabled">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary hidden sm:inline">
            Protected
          </span>
        </div>
      </header>

      {/* Notice Banner */}
      <div className="bg-[#E7E2D8] border-b border-line px-4 py-2 text-[12px] text-ink-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>Non-downloadable clinical viewer · Digital watermarked</span>
        </div>
        <span className="text-[11px] font-mono text-ink-muted">Pinch to zoom</span>
      </div>

      {/* Scrollable PDF Pages */}
      <main className="p-4 sm:p-6 space-y-4 max-w-[480px] mx-auto w-full">
        {guide.pages.map((page: any) => (
          <PdfPage
            key={page.pageNumber}
            page={page}
            totalPages={guide.pages.length}
            clientWatermark={clientWatermark}
            onSecurityNotice={showSecurityToast}
          />
        ))}
      </main>

      {/* Footer Info */}
      <footer className="p-6 text-center text-[12px] text-ink-muted">
        End of document · Harbourline Care Protocol Library
      </footer>
    </div>
  );
};
