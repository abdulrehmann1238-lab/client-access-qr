import { create } from 'zustand';
import { useSession } from './useSession';
import { useRequests } from './useRequests';

export interface ChecklistState {
  unlockedPasscode: boolean;
  submittedForm: boolean;
  openedPdf: boolean;
  tappedCall: boolean;
  downloadedCsv: boolean;
  testedPrivacy: boolean;
}

interface SimulateState {
  linkState: 'valid' | 'missing' | 'expired';
  forceError: boolean;
  slowNetwork: boolean;
  deviceFrame: 'iphone' | 'android';
  activeShellTab: 'sheet' | 'security' | 'delivery';
  checklist: ChecklistState;
  fastIdle: boolean;
  manualOnCallOverride: boolean | null;

  // Actions
  setLinkState: (state: 'valid' | 'missing' | 'expired') => void;
  setForceError: (val: boolean) => void;
  setSlowNetwork: (val: boolean) => void;
  setDeviceFrame: (frame: 'iphone' | 'android') => void;
  setActiveShellTab: (tab: 'sheet' | 'security' | 'delivery') => void;
  markChecklist: (key: keyof ChecklistState) => void;
  setFastIdle: (val: boolean) => void;
  toggleOnCallOverride: () => void;
  resetDemo: () => void;
}

export const useSimulate = create<SimulateState>((set) => ({
  linkState: 'valid',
  forceError: false,
  slowNetwork: false,
  deviceFrame: 'iphone',
  activeShellTab: 'sheet',
  fastIdle: false,
  manualOnCallOverride: true, // Default to true so client sees active on-call status immediately
  checklist: {
    unlockedPasscode: false,
    submittedForm: false,
    openedPdf: false,
    tappedCall: false,
    downloadedCsv: false,
    testedPrivacy: false,
  },

  setLinkState: (state) => set({ linkState: state }),
  setForceError: (val) => set({ forceError: val }),
  setSlowNetwork: (val) => set({ slowNetwork: val }),
  setDeviceFrame: (frame) => set({ deviceFrame: frame }),
  setActiveShellTab: (tab) => set({ activeShellTab: tab }),

  markChecklist: (key) =>
    set((s) => ({
      checklist: { ...s.checklist, [key]: true },
    })),

  setFastIdle: (val) => set({ fastIdle: val }),

  toggleOnCallOverride: () =>
    set((s) => ({
      manualOnCallOverride: s.manualOnCallOverride === null ? true : !s.manualOnCallOverride,
    })),

  resetDemo: () => {
    useSession.getState().logout();
    useSession.getState().resetAttempts();
    useRequests.getState().resetRequests();
    set({
      linkState: 'valid',
      forceError: false,
      slowNetwork: false,
      checklist: {
        unlockedPasscode: false,
        submittedForm: false,
        openedPdf: false,
        tappedCall: false,
        downloadedCsv: false,
        testedPrivacy: false,
      },
      fastIdle: false,
      manualOnCallOverride: true,
    });
  },
}));
