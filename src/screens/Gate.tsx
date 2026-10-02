import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, HelpCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { PasscodeInput } from '../components/product/PasscodeInput';
import { Button } from '../components/ui/Button';
import { Sheet } from '../components/ui/Sheet';
import { BRAND } from '../config/brand';
import { useSession } from '../store/useSession';
import { mockApi } from '../mock/api';

export const Gate: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLocked,
    lockReason,
    lockoutRemaining,
    tickLockout,
    client,
  } = useSession();

  const [enteredCode, setEnteredCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining > 0) {
      const interval = setInterval(() => {
        tickLockout();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutRemaining, tickLockout]);

  const handleVerify = async (code: string) => {
    if (lockoutRemaining > 0 || isVerifying || isSuccess) return;

    setEnteredCode(code);
    setIsVerifying(true);
    setErrorMessage('');

    try {
      const res = await mockApi.verifyPasscode(code);
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/menu');
        }, 650);
      } else {
        setErrorMessage(res.error || "That code doesn't match.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failure. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-6 max-w-[420px] mx-auto animate-fade-in text-center">
      {/* Top Branding */}
      <div className="pt-2 pb-6">
        <div className="inline-flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary text-white flex items-center justify-center font-heading text-lg font-bold shadow-sm">
            h
          </div>
          <div className="text-left">
            <span className="font-heading text-[19px] font-medium text-ink block leading-none">
              {BRAND.shortName}
            </span>
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-ink-2 block mt-0.5">
              {BRAND.descriptor}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="my-auto py-4">
        <h1 className="font-heading text-[30px] sm:text-[34px] font-medium text-ink leading-tight mb-2">
          {isLocked && lockReason === 'idle' ? 'Welcome back' : 'Welcome back'}
        </h1>
        <p className="text-[15px] text-ink-2 max-w-[320px] mx-auto leading-relaxed mb-6">
          {isLocked && lockReason === 'idle'
            ? 'For your privacy, we locked this page. Enter your code to continue.'
            : 'Enter your 4-letter access code. It’s the first four letters of your street name.'}
        </p>

        {/* 4-Cell Passcode Field */}
        <PasscodeInput
          onComplete={handleVerify}
          isVerifying={isVerifying}
          isSuccess={isSuccess}
          isLocked={lockoutRemaining > 0}
          lockoutRemaining={lockoutRemaining}
          errorMessage={errorMessage}
        />

        {/* Helper Link */}
        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="mt-6 inline-flex items-center gap-1.5 text-[14px] text-primary hover:underline font-medium cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Where do I find this?</span>
        </button>

        {/* Unlock Action Button */}
        <div className="mt-6">
          <Button
            variant="primary"
            isLoading={isVerifying}
            isSuccess={isSuccess}
            disabled={enteredCode.length < 4 || lockoutRemaining > 0}
            onClick={() => handleVerify(enteredCode)}
          >
            <span className="flex items-center justify-center gap-2">
              <span>Unlock</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
        </div>
      </div>

      {/* Footer reassurance */}
      <div className="pt-6 pb-2 text-[12px] text-ink-muted flex items-center justify-center gap-1.5">
        <Lock className="w-3.5 h-3.5" />
        <span>Private and encrypted. Don't share this page.</span>
      </div>

      {/* "Where do I find this?" Bottom Sheet */}
      <Sheet
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Your 4-Letter Access Code"
      >
        <div className="space-y-4">
          <p className="text-[14px] text-ink-2 leading-relaxed">
            Your access code consists of the first four letters of your home street address as registered with our clinic care team.
          </p>

          <div className="p-4 rounded-md bg-surface-raised border border-line space-y-2">
            <span className="text-[12px] font-semibold uppercase text-ink-muted tracking-wide">
              Examples
            </span>
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-ink">123 <strong className="text-primary font-semibold">Mapl</strong>e Avenue</span>
              <span className="font-mono font-semibold px-2 py-0.5 bg-secondary text-primary rounded">MAPL</span>
            </div>
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-ink">88 <strong className="text-primary font-semibold">Ceda</strong>r Crescent</span>
              <span className="font-mono font-semibold px-2 py-0.5 bg-secondary text-primary rounded">CEDA</span>
            </div>
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-ink">17 <strong className="text-primary font-semibold">Harb</strong>our Street</span>
              <span className="font-mono font-semibold px-2 py-0.5 bg-secondary text-primary rounded">HARB</span>
            </div>
          </div>

          <p className="text-[13px] text-ink-muted">
            If you recently moved or cannot find your street code on your fridge magnet, call our clinic at <a href={BRAND.phoneRaw} className="text-primary underline font-medium">{BRAND.phone}</a>.
          </p>

          <Button variant="secondary" onClick={() => setIsHelpOpen(false)}>
            Got it
          </Button>
        </div>
      </Sheet>
    </div>
  );
};
