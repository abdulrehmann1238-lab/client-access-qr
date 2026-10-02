import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';
import { useSimulate } from '../../store/useSimulate';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const { deviceFrame } = useSimulate();
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).replace(/\s?[AP]M/, '')
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex justify-center items-center py-2 sm:py-6">
      {/* Phone container */}
      <div
        className={`
          relative w-full max-w-[390px] h-[100dvh] sm:h-[844px] bg-bg flex flex-col overflow-hidden
          sm:rounded-[46px] sm:border-[8px] sm:border-[#1F2624] sm:shadow-[0_25px_60px_-15px_rgba(27,36,33,0.3)]
        `}
      >
        {/* Device Status Bar */}
        <div className="h-11 px-6 pt-3 shrink-0 flex items-center justify-between text-ink select-none text-[13px] font-semibold tracking-tight z-30">
          <span>{time || '9:41'}</span>

          {/* Notch / Dynamic Island / Punch Hole */}
          {deviceFrame === 'iphone' ? (
            <div className="w-24 h-4 bg-black rounded-full mx-auto" />
          ) : (
            <div className="w-3.5 h-3.5 bg-black rounded-full mx-auto" />
          )}

          <div className="flex items-center gap-1.5 text-ink">
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <div className="w-4 h-2.5 border border-ink rounded-sm p-[1px] flex items-center">
              <div className="w-full h-full bg-ink rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Scrollable screen viewport */}
        <div className="flex-1 overflow-y-auto custom-scroll relative flex flex-col bg-bg">
          {children}
        </div>

        {/* Home Indicator bar for iPhone */}
        {deviceFrame === 'iphone' && (
          <div className="h-5 shrink-0 flex items-center justify-center pointer-events-none pb-1">
            <div className="w-32 h-1 bg-ink/30 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
