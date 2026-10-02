import { create } from 'zustand';
import clientsData from '../data/clients.json';
import { BRAND } from '../config/brand';

export interface Medication {
  id: string;
  name: string;
  strength: string;
  instructions: string;
  lastFilled: string;
  refillsRemaining: number;
}

export interface ClientProfile {
  passcode: string;
  name: string;
  street: string;
  medications: Medication[];
}

interface SessionState {
  client: ClientProfile | null;
  isAuthenticated: boolean;
  isLocked: boolean;
  lockReason: 'idle' | 'manual' | null;
  attemptsCount: number;
  lockoutRemaining: number; // in seconds
  idleSecondsRemaining: number;
  isUnlockedOnce: boolean;
  
  // Actions
  verifyPasscode: (code: string) => { success: boolean; error?: string };
  unlockWithPasscode: (code: string) => boolean;
  logout: () => void;
  lockPortal: (reason?: 'idle' | 'manual') => void;
  tickIdle: () => void;
  resetIdle: () => void;
  tickLockout: () => void;
  resetAttempts: () => void;
  setClientDirectly: (passcode: string) => void;
}

const DEFAULT_IDLE_SECONDS = 300; // 5 minutes

export const useSession = create<SessionState>((set, get) => ({
  client: null,
  isAuthenticated: false,
  isLocked: false,
  lockReason: null,
  attemptsCount: 0,
  lockoutRemaining: 0,
  idleSecondsRemaining: DEFAULT_IDLE_SECONDS,
  isUnlockedOnce: false,

  verifyPasscode: (code: string) => {
    const { lockoutRemaining, attemptsCount } = get();
    if (lockoutRemaining > 0) {
      return { 
        success: false, 
        error: `Too many attempts. Please try again in 0:${lockoutRemaining.toString().padStart(2, '0')} or call the office.` 
      };
    }

    const cleanCode = code.trim().toUpperCase();
    const found = clientsData.find(c => c.passcode === cleanCode);

    if (found) {
      set({
        client: found as ClientProfile,
        isAuthenticated: true,
        isLocked: false,
        lockReason: null,
        attemptsCount: 0,
        idleSecondsRemaining: DEFAULT_IDLE_SECONDS,
        isUnlockedOnce: true,
      });
      return { success: true };
    } else {
      const nextAttempts = attemptsCount + 1;
      if (nextAttempts >= 5) {
        set({ attemptsCount: nextAttempts, lockoutRemaining: 60 });
        return { 
          success: false, 
          error: 'Too many attempts. Account locked for 60 seconds. Please try again later or call the office.' 
        };
      }
      set({ attemptsCount: nextAttempts });
      const remaining = 5 - nextAttempts;
      return { 
        success: false, 
        error: remaining <= 2 
          ? `That code doesn't match. ${remaining} attempt${remaining === 1 ? '' : 's'} left.`
          : "That code doesn't match. Check the first four letters of your street name."
      };
    }
  },

  unlockWithPasscode: (code: string) => {
    const res = get().verifyPasscode(code);
    return res.success;
  },

  logout: () => {
    set({
      client: null,
      isAuthenticated: false,
      isLocked: false,
      lockReason: null,
      idleSecondsRemaining: DEFAULT_IDLE_SECONDS,
    });
  },

  lockPortal: (reason = 'manual') => {
    set({
      isLocked: true,
      lockReason: reason,
    });
  },

  tickIdle: () => {
    const { idleSecondsRemaining, isAuthenticated, isLocked } = get();
    if (isAuthenticated && !isLocked) {
      if (idleSecondsRemaining <= 1) {
        set({ isLocked: true, lockReason: 'idle', idleSecondsRemaining: 0 });
      } else {
        set({ idleSecondsRemaining: idleSecondsRemaining - 1 });
      }
    }
  },

  resetIdle: () => {
    set({ idleSecondsRemaining: DEFAULT_IDLE_SECONDS });
  },

  tickLockout: () => {
    const { lockoutRemaining } = get();
    if (lockoutRemaining > 0) {
      set({ lockoutRemaining: lockoutRemaining - 1 });
    }
  },

  resetAttempts: () => {
    set({ attemptsCount: 0, lockoutRemaining: 0 });
  },

  setClientDirectly: (passcode: string) => {
    const found = clientsData.find(c => c.passcode === passcode.toUpperCase());
    if (found) {
      set({
        client: found as ClientProfile,
        isAuthenticated: true,
        isLocked: false,
        attemptsCount: 0,
        idleSecondsRemaining: DEFAULT_IDLE_SECONDS,
        isUnlockedOnce: true,
      });
    }
  },
}));
