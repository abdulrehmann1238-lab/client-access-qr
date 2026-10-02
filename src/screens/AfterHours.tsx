import React, { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PhoneCall, AlertCircle, Phone, Check, ShieldAlert } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { ChipGroup } from '../components/ui/Chips';
import { Button } from '../components/ui/Button';
import { Sheet } from '../components/ui/Sheet';
import { Toast, ToastMessage } from '../components/ui/Toast';
import { useSession } from '../store/useSession';
import { useSimulate } from '../store/useSimulate';
import { mockApi } from '../mock/api';
import { BRAND } from '../config/brand';

const URGENCY_OPTIONS = [
  { value: 'Question', label: 'Question' },
  { value: 'Needs attention soon', label: 'Needs attention soon' },
  { value: 'Urgent', label: 'Urgent' },
];

const RECIPIENT_OPTIONS = [
  { value: 'Me', label: 'Me' },
  { value: 'Someone I care for', label: 'Someone I care for' },
];

export const AfterHours: React.FC = () => {
  const navigate = useNavigate();
  const { client } = useSession();
  const { manualOnCallOverride } = useSimulate();

  const [callerName, setCallerName] = useState(client ? client.name : 'Amara O.');
  const [callbackNumber, setCallbackNumber] = useState('(905) 555-0147');
  const [recipient, setRecipient] = useState<'Me' | 'Someone I care for'>('Me');
  const [urgency, setUrgency] = useState<'Question' | 'Needs attention soon' | 'Urgent'>('Needs attention soon');
  const [summary, setSummary] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [callSheetOpen, setCallSheetOpen] = useState(false);
  const [callFailureNotice, setCallFailureNotice] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Phone number formatter
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = raw;
    if (raw.length > 3 && raw.length <= 6) {
      formatted = `(${raw.slice(0, 3)}) ${raw.slice(3)}`;
    } else if (raw.length > 6) {
      formatted = `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6, 10)}`;
    }
    setCallbackNumber(formatted);
  };

  const isFormValid =
    callerName.trim().length >= 2 &&
    callbackNumber.replace(/\D/g, '').length >= 10 &&
    urgency &&
    summary.trim().length >= 5;

  const handleInitiateCall = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setCallFailureNotice(null);

    try {
      const res = await mockApi.submitAfterHours({
        client: client?.passcode || 'MAPL',
        clientName: client?.name || 'Amara O.',
        callerName,
        callbackNumber,
        recipient,
        urgency,
        summary: summary.trim(),
      });

      if (res.success) {
        setToast({
          id: String(Date.now()),
          type: 'success',
          message: 'Your details were recorded. Connecting you now.',
        });
      } else {
        setCallFailureNotice(res.error || "We couldn't save your details, but you can still call.");
      }

      // Open mock call dialer sheet
      setCallSheetOpen(true);
    } catch (err: any) {
      setCallFailureNotice("We couldn't save your details, but you can still call.");
      setCallSheetOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-5 max-w-[440px] mx-auto animate-fade-in text-left">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-1.5 text-[15px] font-medium text-ink-2 hover:text-primary transition-colors cursor-pointer py-1 -ml-1 pr-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className="text-[12px] font-mono text-ink-muted">CLINICAL TRIAGE</span>
        </div>

        <h1 className="font-heading text-[26px] sm:text-[28px] font-medium text-ink mb-1">
          After hours support
        </h1>

        {/* Info line with on-call badge */}
        <div className="flex items-center gap-2 text-[13px] text-ink-2 mb-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-clinical-success inline-block animate-pulse" />
            <span className="font-semibold text-clinical-success">On call now</span>
          </span>
          <span className="text-ink-muted">•</span>
          <span>{BRAND.supportHours}</span>
        </div>

        {/* Emergency Notice Card (Always visible, red-free accent) */}
        <div className="p-4 rounded-lg bg-accent-soft border border-[#ECD1C4] mb-6 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[14px] text-ink block">
              Emergency Advisory
            </span>
            <p className="text-[13px] text-ink leading-relaxed mt-0.5">
              If this is a life-threatening medical emergency, call <strong>911</strong> immediately or visit the nearest emergency room.
            </p>
          </div>
        </div>

        {/* Triage Form */}
        <div className="space-y-4">
          <Input
            label="Your full name"
            value={callerName}
            onChange={(e) => setCallerName(e.target.value)}
            placeholder="First and last name"
          />

          <Input
            type="tel"
            inputMode="tel"
            label="Callback phone number"
            value={callbackNumber}
            onChange={handlePhoneChange}
            placeholder="(555) 000-0000"
            helper="The clinician will call this number immediately."
          />

          <div>
            <label className="block text-[13px] font-medium text-ink-2 mb-2">
              Who needs clinical help?
            </label>
            <ChipGroup
              options={RECIPIENT_OPTIONS}
              value={recipient}
              onChange={(val) => setRecipient(val as any)}
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-ink-2 mb-2">
              Urgency level
            </label>
            <ChipGroup
              options={URGENCY_OPTIONS}
              value={urgency}
              onChange={(val) => setUrgency(val as any)}
            />
          </div>

          <Textarea
            label="Brief description of what you are experiencing"
            placeholder="e.g. Infusion pump high pressure alarm won't clear, feeling mild nausea."
            maxLength={140}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
      </div>

      {/* Conditional Sticky Tap to Call Button */}
      <div className="pt-6 pb-2 sticky bottom-0 bg-bg/95 backdrop-blur-sm -mx-5 px-5 border-t border-line/70">
        <Button
          variant={isFormValid ? 'call' : 'primary'}
          disabled={!isFormValid || isSubmitting}
          isLoading={isSubmitting}
          onClick={handleInitiateCall}
          className="transition-all duration-300"
        >
          <div className="flex items-center justify-center gap-2.5">
            <PhoneCall className={`w-5 h-5 ${isFormValid ? 'animate-bounce' : ''}`} />
            <span>
              {isFormValid
                ? 'Tap to call on-call clinician'
                : 'Complete the form to call'}
            </span>
          </div>
        </Button>
      </div>

      {/* Call Dialer Sheet */}
      <Sheet
        isOpen={callSheetOpen}
        onClose={() => {
          setCallSheetOpen(false);
          setSummary('');
        }}
        title="Calling Clinical Support"
      >
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-accent-soft text-accent flex items-center justify-center mx-auto ring-8 ring-accent-soft/40">
            <Phone className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <h3 className="font-heading text-[20px] font-medium text-ink">
              Calling Harbourline On-Call…
            </h3>
            <p className="font-mono text-[16px] text-accent font-semibold mt-1">
              {BRAND.phone}
            </p>
          </div>

          {callFailureNotice ? (
            <div className="p-3 rounded-md bg-[#FAF4ED] border border-[#ECD9C8] text-[13px] text-ink-2">
              <strong className="text-accent block">Safety Override:</strong>
              {callFailureNotice}
            </div>
          ) : (
            <p className="text-[13px] text-ink-2">
              Your triage request was securely logged in the staff dispatch queue. An on-call nurse is standing by to accept your call.
            </p>
          )}

          <div className="pt-2 space-y-2">
            <a
              href={BRAND.phoneRaw}
              className="w-full min-h-[52px] h-[52px] rounded-md bg-accent hover:bg-[#A34724] text-white font-semibold inline-flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Connect call on device</span>
            </a>
            <Button
              variant="ghost"
              onClick={() => {
                setCallSheetOpen(false);
                setSummary('');
              }}
            >
              Done & close
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
};
