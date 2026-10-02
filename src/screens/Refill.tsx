import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, MapPin, Calendar, Clock, AlertTriangle, PhoneCall } from 'lucide-react';
import { StepHeader } from '../components/product/StepHeader';
import { MedicationRow } from '../components/product/MedicationRow';
import { SuccessView } from '../components/product/SuccessView';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { ChipGroup } from '../components/ui/Chips';
import { Sheet } from '../components/ui/Sheet';
import { useSession } from '../store/useSession';
import { mockApi } from '../mock/api';
import { BRAND } from '../config/brand';

const PHARMACIES = [
  { value: 'Lakeshore Pharmacy (Main St)', label: 'Lakeshore Pharmacy — Main St' },
  { value: 'Riverside Pharmacy', label: 'Riverside Pharmacy — Medical Arts' },
  { value: 'Clinic Dispensary (on site)', label: 'Clinic Dispensary — On Site Care' },
];

export const Refill: React.FC = () => {
  const navigate = useNavigate();
  const { client } = useSession();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMedIds, setSelectedMedIds] = useState<string[]>([]);
  const [customMed, setCustomMed] = useState('');
  const [showCustomMedInput, setShowCustomMedInput] = useState(false);
  const [additionalMeds, setAdditionalMeds] = useState<string[]>([]);

  // Step 2 state
  const [deliveryPreference, setDeliveryPreference] = useState<'Pick up' | 'Delivery'>('Pick up');
  const [pharmacy, setPharmacy] = useState(PHARMACIES[0].value);
  const [dateChoice, setDateChoice] = useState<'Today' | 'Tomorrow' | 'Custom'>('Today');
  const [customDate, setCustomDate] = useState('');
  const [notes, setNotes] = useState('');

  // Step 3 state
  const [confirmedConsent, setConfirmedConsent] = useState(false);

  // Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successRef, setSuccessRef] = useState<string | null>(null);

  // Available medications for current client
  const clientMeds = client?.medications || [];

  const handleToggleMed = (id: string) => {
    setSelectedMedIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleAddCustomMed = () => {
    if (customMed.trim()) {
      setAdditionalMeds((prev) => [...prev, customMed.trim()]);
      setCustomMed('');
      setShowCustomMedInput(false);
    }
  };

  const selectedMedNames = [
    ...clientMeds.filter((m) => selectedMedIds.includes(m.id)).map((m) => `${m.name} (${m.strength})`),
    ...additionalMeds,
  ];

  const handleNextStep1 = () => {
    if (selectedMedNames.length === 0) {
      alert('Please select at least one prescription to continue.');
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!confirmedConsent || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const effectiveDate = dateChoice === 'Custom' ? (customDate || 'Upcoming date') : dateChoice;

    try {
      const res = await mockApi.submitRefill({
        client: client?.passcode || 'MAPL',
        clientName: client?.name || 'Amara O.',
        medications: selectedMedNames,
        deliveryPreference,
        pharmacy,
        preferredDate: effectiveDate,
        notes: notes.trim() || undefined,
      });

      setSuccessRef(res.ref);
    } catch (err: any) {
      setSubmitError(err.message || "We couldn't send your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If successfully submitted, render confirmation view
  if (successRef) {
    return (
      <SuccessView
        reference={successRef}
        title="Request sent"
        message="Request sent. Your care team has it, and we'll text you when it's ready."
        turnaroundNote="Typical turnaround: same business day. If urgent, call our after-hours line."
        onBackToMenu={() => navigate('/menu')}
        onRequestAnother={() => {
          setSuccessRef(null);
          setSelectedMedIds([]);
          setAdditionalMeds([]);
          setStep(1);
        }}
        anotherLabel="Request another refill"
      />
    );
  }

  return (
    <div className="min-h-full flex flex-col justify-between p-5 max-w-[440px] mx-auto animate-fade-in text-left">
      <div>
        <StepHeader
          currentStep={step}
          totalSteps={3}
          title="Refill"
          onBack={() => {
            if (step === 1) navigate('/menu');
            else setStep((s) => (s - 1) as any);
          }}
        />

        {/* STEP 1: CHOOSE MEDICATIONS */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="mb-2">
              <h2 className="font-heading text-[18px] font-medium text-ink">
                Choose medications
              </h2>
              <p className="text-[13px] text-ink-2 mt-0.5">
                Select from your active prescriptions or add another item.
              </p>
            </div>

            <div className="space-y-2.5">
              {clientMeds.map((med) => (
                <MedicationRow
                  key={med.id}
                  medication={med}
                  isSelected={selectedMedIds.includes(med.id)}
                  onToggle={() => handleToggleMed(med.id)}
                />
              ))}

              {additionalMeds.map((med, idx) => (
                <div
                  key={`custom-${idx}`}
                  className="p-3.5 rounded-lg bg-surface border border-primary ring-1 ring-primary flex items-center justify-between"
                >
                  <div>
                    <span className="font-heading text-[16px] font-medium text-ink block">
                      {med}
                    </span>
                    <span className="text-[12px] text-ink-muted">Manual request entry</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdditionalMeds((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-[13px] text-clinical-error font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Add medication toggle */}
            {!showCustomMedInput ? (
              <button
                type="button"
                onClick={() => setShowCustomMedInput(true)}
                className="w-full py-3 px-4 rounded-lg border border-dashed border-line-strong hover:border-primary text-primary text-[14px] font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors bg-surface-raised"
              >
                <Plus className="w-4 h-4" />
                <span>Not listed? Add a medication</span>
              </button>
            ) : (
              <div className="p-4 rounded-lg bg-surface border border-line space-y-3">
                <Input
                  label="Medication Name & Strength"
                  placeholder="e.g., Amoxicillin 500 mg capsules"
                  value={customMed}
                  onChange={(e) => setCustomMed(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setShowCustomMedInput(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" disabled={!customMed.trim()} onClick={handleAddCustomMed}>
                    Add item
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: DELIVERY & PHARMACY */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="font-heading text-[18px] font-medium text-ink">
                Fulfillment details
              </h2>
              <p className="text-[13px] text-ink-2 mt-0.5">
                Choose how and where you wish to receive your medication.
              </p>
            </div>

            {/* Delivery vs Pickup */}
            <div>
              <label className="block text-[13px] font-medium text-ink-2 mb-2">
                Collection method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Pick up', 'Delivery'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setDeliveryPreference(method)}
                    className={`
                      h-[52px] rounded-md border text-[15px] font-medium flex items-center justify-center gap-2 transition-all cursor-pointer
                      ${
                        deliveryPreference === method
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-surface text-ink-2 border-line-strong hover:border-primary/60'
                      }
                    `}
                  >
                    <span>{method}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pharmacy selection */}
            <div>
              <label htmlFor="pharmacy-select" className="block text-[13px] font-medium text-ink-2 mb-1.5">
                Preferred pharmacy
              </label>
              <div className="relative">
                <select
                  id="pharmacy-select"
                  value={pharmacy}
                  onChange={(e) => setPharmacy(e.target.value)}
                  className="w-full h-[56px] px-4 rounded-md bg-surface text-ink text-[16px] border border-line-strong focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/60 cursor-pointer"
                >
                  {PHARMACIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date options */}
            <div>
              <label className="block text-[13px] font-medium text-ink-2 mb-2">
                Preferred date
              </label>
              <ChipGroup
                options={[
                  { value: 'Today', label: 'Today' },
                  { value: 'Tomorrow', label: 'Tomorrow' },
                  { value: 'Custom', label: 'Choose date' },
                ]}
                value={dateChoice}
                onChange={(val) => setDateChoice(val as any)}
              />

              {dateChoice === 'Custom' && (
                <div className="mt-3">
                  <Input
                    type="date"
                    label="Select date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Notes */}
            <Textarea
              label="Optional notes for pharmacist"
              placeholder="e.g., Leave on front porch or call when dispensed."
              maxLength={280}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        )}

        {/* STEP 3: REVIEW & SEND */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="font-heading text-[18px] font-medium text-ink">
                Review & send
              </h2>
              <p className="text-[13px] text-ink-2 mt-0.5">
                Verify your medication selections before submitting to your clinical care team.
              </p>
            </div>

            {/* Summary Card */}
            <div className="p-4 rounded-lg bg-surface border border-line space-y-4">
              <div className="border-b border-line pb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-ink-muted">
                    Prescriptions ({selectedMedNames.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[13px] text-primary underline font-medium cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <ul className="space-y-1">
                  {selectedMedNames.map((med, i) => (
                    <li key={i} className="text-[14px] text-ink font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{med}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-ink-muted">
                    Fulfillment
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-[13px] text-primary underline font-medium cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-[14px] text-ink font-medium">
                  {deliveryPreference} — {pharmacy}
                </p>
                <p className="text-[13px] text-ink-2 mt-0.5">
                  Preferred date: {dateChoice === 'Custom' ? (customDate || 'Upcoming date') : dateChoice}
                </p>
                {notes && (
                  <p className="text-[13px] text-ink-muted italic mt-1">
                    "{notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Consent checkbox */}
            <label className="flex items-start gap-3 p-3.5 rounded-lg bg-surface border border-line-strong cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmedConsent}
                onChange={(e) => setConfirmedConsent(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-line-strong text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-[14px] leading-snug text-ink">
                I confirm these details are correct and authorize Harbourline Clinical Care to coordinate my prescription renewal.
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="pt-6 pb-2">
        {step === 1 && (
          <Button
            variant="primary"
            disabled={selectedMedNames.length === 0}
            onClick={handleNextStep1}
          >
            Continue to delivery ({selectedMedNames.length} selected)
          </Button>
        )}

        {step === 2 && (
          <Button variant="primary" onClick={handleNextStep2}>
            Review request
          </Button>
        )}

        {step === 3 && (
          <Button
            variant="primary"
            disabled={!confirmedConsent || isSubmitting}
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            Send request
          </Button>
        )}
      </div>

      {/* Error bottom sheet */}
      <Sheet
        isOpen={!!submitError}
        onClose={() => setSubmitError(null)}
        title="We couldn't send your request"
      >
        <div className="space-y-4">
          <p className="text-[14px] text-ink-2 leading-relaxed">
            {submitError || 'Something didn’t go through. Your entered information is preserved. Please try submitting again, or reach our office.'}
          </p>

          <div className="space-y-2.5 pt-2">
            <Button variant="primary" onClick={handleSubmit}>
              Try again
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
