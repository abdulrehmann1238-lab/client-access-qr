import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, PhoneCall, Mail, Package, MapPin } from 'lucide-react';
import { SuccessView } from '../components/product/SuccessView';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Sheet } from '../components/ui/Sheet';
import { useSession } from '../store/useSession';
import { mockApi } from '../mock/api';
import { BRAND } from '../config/brand';

const DOCUMENT_TYPES = [
  'Medical summary',
  'Immunization record',
  'Insurance letter',
  'Care plan',
  'Receipts for taxes',
  'Other',
];

export const Documents: React.FC = () => {
  const navigate = useNavigate();
  const { client } = useSession();

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'Secure email' | 'Pickup' | 'Mail'>('Secure email');
  const [emailAddress, setEmailAddress] = useState('amara.o@example.ca');
  const [mailingAddress, setMailingAddress] = useState(client ? `${client.street}, ON` : '214 Maple Avenue, ON');
  const [notes, setNotes] = useState('');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successRef, setSuccessRef] = useState<string | null>(null);

  const toggleType = (t: string) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTypes.length === 0) {
      setValidationError('Please select at least one document type.');
      return;
    }

    if (selectedTypes.includes('Other') && !otherText.trim()) {
      setValidationError('Please describe the document you require in the Other field.');
      return;
    }

    if (deliveryMethod === 'Secure email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailAddress)) {
        setValidationError('Please enter a valid email address for secure delivery.');
        return;
      }
    }

    if (deliveryMethod === 'Mail' && !mailingAddress.trim()) {
      setValidationError('Please enter a destination mailing address.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const docItems = selectedTypes.map((t) => (t === 'Other' ? `Other: ${otherText}` : t));
    const deliveryDetails =
      deliveryMethod === 'Secure email'
        ? emailAddress
        : deliveryMethod === 'Mail'
        ? mailingAddress
        : 'In-person clinic pickup';

    try {
      const res = await mockApi.submitDocuments({
        client: client?.passcode || 'MAPL',
        clientName: client?.name || 'Amara O.',
        documentTypes: docItems,
        deliveryMethod,
        deliveryDetails,
        notes: notes.trim() || undefined,
      });

      setSuccessRef(res.ref);
    } catch (err: any) {
      setSubmitError(err.message || 'Something didn’t go through. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successRef) {
    return (
      <SuccessView
        reference={successRef}
        title="Request received"
        message="Request received. We'll prepare your documents and let you know how to collect them."
        turnaroundNote="Most documents are ready within 2 business days. Sensitive summaries are encrypted."
        onBackToMenu={() => navigate('/menu')}
        onRequestAnother={() => {
          setSuccessRef(null);
          setSelectedTypes([]);
          setOtherText('');
          setNotes('');
        }}
        anotherLabel="Request another document"
      />
    );
  }

  return (
    <div className="min-h-full flex flex-col justify-between p-5 max-w-[440px] mx-auto animate-fade-in text-left">
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
          <span className="text-[12px] font-mono text-ink-muted">CLINICAL RECORDS</span>
        </div>

        <h1 className="font-heading text-[26px] sm:text-[28px] font-medium text-ink mb-1">
          Request documents
        </h1>
        <p className="text-[14px] text-ink-2 mb-6">
          Order formal records, letters, and clinical summaries prepared by your care team.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Types Checklist */}
          <div>
            <label className="block text-[13px] font-medium text-ink-2 mb-2 tracking-[0.02em]">
              Document type (select all that apply)
            </label>
            <div className="space-y-2">
              {DOCUMENT_TYPES.map((type) => {
                const isChecked = selectedTypes.includes(type);
                return (
                  <div
                    key={type}
                    role="checkbox"
                    aria-checked={isChecked}
                    tabIndex={0}
                    onClick={() => toggleType(type)}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        toggleType(type);
                      }
                    }}
                    className={`
                      p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between select-none
                      ${
                        isChecked
                          ? 'bg-[#FAFBF9] border-primary ring-1 ring-primary'
                          : 'bg-surface border-line hover:border-line-strong'
                      }
                    `}
                  >
                    <span className="text-[15px] font-medium text-ink">{type}</span>
                    <div
                      className={`
                        w-5 h-5 rounded border shrink-0 flex items-center justify-center transition-colors
                        ${
                          isChecked
                            ? 'bg-primary border-primary text-white'
                            : 'border-line-strong bg-surface'
                        }
                      `}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Conditional "Other" text input */}
            {selectedTypes.includes('Other') && (
              <div className="mt-3 animate-slide-up">
                <Input
                  label="Specify other document details"
                  placeholder="e.g., Physiotherapy discharge report"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Delivery Method Radio */}
          <div>
            <label className="block text-[13px] font-medium text-ink-2 mb-2 tracking-[0.02em]">
              Delivery method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Secure email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
                { id: 'Pickup', label: 'Pickup', icon: <Package className="w-4 h-4" /> },
                { id: 'Mail', label: 'Mail', icon: <MapPin className="w-4 h-4" /> },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setDeliveryMethod(m.id as any)}
                  className={`
                    h-[48px] rounded-md border text-[14px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer
                    ${
                      deliveryMethod === m.id
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-surface text-ink-2 border-line-strong hover:border-primary/60'
                    }
                  `}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Conditional Delivery Detail Fields */}
            {deliveryMethod === 'Secure email' && (
              <div className="mt-3 animate-slide-up">
                <Input
                  type="email"
                  label="Recipient email address (encrypted PDF sent with password)"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
            )}

            {deliveryMethod === 'Mail' && (
              <div className="mt-3 animate-slide-up">
                <Input
                  label="Destination postal address"
                  value={mailingAddress}
                  onChange={(e) => setMailingAddress(e.target.value)}
                  placeholder="Full street address, postal code"
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <Textarea
            label="Additional instructions or timeline requirements (optional)"
            placeholder="e.g., Need signed by Dr. Miller for insurance submission by Friday."
            maxLength={280}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {validationError && (
            <div className="p-3 rounded-md bg-[#FDF2F0] border border-[#F5C2BC] text-clinical-error text-[13px]">
              {validationError}
            </div>
          )}

          <div className="pt-2 pb-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Send request
            </Button>
          </div>
        </form>
      </div>

      {/* Error bottom sheet */}
      <Sheet
        isOpen={!!submitError}
        onClose={() => setSubmitError(null)}
        title="We couldn't send your request"
      >
        <div className="space-y-4">
          <p className="text-[14px] text-ink-2 leading-relaxed">
            {submitError}
          </p>
          <div className="space-y-2 pt-2">
            <Button variant="primary" onClick={handleSubmit}>
              Retry submission
            </Button>
            <a
              href={BRAND.phoneRaw}
              className="w-full min-h-[52px] h-[52px] rounded-md bg-surface border border-line text-ink font-medium inline-flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-primary" />
              <span>Call the office: {BRAND.phone}</span>
            </a>
          </div>
        </div>
      </Sheet>
    </div>
  );
};
