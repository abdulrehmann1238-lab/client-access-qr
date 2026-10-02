import { create } from 'zustand';
import seedData from '../data/seedRequests.json';

export interface ClinicalRequest {
  id: string;
  timestamp: string;
  ref: string;
  client: string;
  clientName: string;
  type: 'Refill' | 'Documents' | 'After hours';
  details: string;
  urgency: 'Normal' | 'Needs attention soon' | 'Urgent' | 'Question';
  status: 'New' | 'In progress' | 'Ready for pickup' | 'Dispatched' | 'Completed' | 'Call initiated' | 'Pending sync';
  synced: boolean;
  syncedTime?: string;
  isNewArrival?: boolean;
}

interface RequestsState {
  requests: ClinicalRequest[];
  syncMode: 'realtime' | 'hourly';
  filterType: 'All' | 'Refill' | 'Documents' | 'After hours';
  nextRefNumber: {
    refill: number;
    doc: number;
    afterHours: number;
  };

  // Actions
  setSyncMode: (mode: 'realtime' | 'hourly') => void;
  setFilterType: (filter: 'All' | 'Refill' | 'Documents' | 'After hours') => void;
  addRequest: (payload: {
    client: string;
    clientName: string;
    type: 'Refill' | 'Documents' | 'After hours';
    details: string;
    urgency?: 'Normal' | 'Needs attention soon' | 'Urgent' | 'Question';
  }) => string; // returns generated reference
  runHourlySync: () => void;
  resetRequests: () => void;
  exportCsvBlob: () => Blob;
}

const STORAGE_KEY = 'harbourline_clinical_requests';

function loadInitialRequests(): ClinicalRequest[] {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed reading sessionStorage', e);
  }
  return seedData as ClinicalRequest[];
}

function saveRequests(items: ClinicalRequest[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed writing to sessionStorage', e);
  }
}

export const useRequests = create<RequestsState>((set, get) => ({
  requests: loadInitialRequests(),
  syncMode: 'realtime',
  filterType: 'All',
  nextRefNumber: {
    refill: 20413,
    doc: 3187,
    afterHours: 175,
  },

  setSyncMode: (mode) => set({ syncMode: mode }),
  setFilterType: (filter) => set({ filterType: filter }),

  addRequest: ({ client, clientName, type, details, urgency = 'Normal' }) => {
    const state = get();
    let ref = '';
    const now = new Date();
    const timeStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ', ' +
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const exactTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    if (type === 'Refill') {
      ref = `RX-${state.nextRefNumber.refill}`;
      set((s) => ({ nextRefNumber: { ...s.nextRefNumber, refill: s.nextRefNumber.refill + 1 } }));
    } else if (type === 'Documents') {
      ref = `DOC-${state.nextRefNumber.doc}`;
      set((s) => ({ nextRefNumber: { ...s.nextRefNumber, doc: s.nextRefNumber.doc + 1 } }));
    } else {
      ref = `AH-0${state.nextRefNumber.afterHours}`;
      set((s) => ({ nextRefNumber: { ...s.nextRefNumber, afterHours: s.nextRefNumber.afterHours + 1 } }));
    }

    const isHourly = state.syncMode === 'hourly';

    const newRow: ClinicalRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: timeStr,
      ref,
      client,
      clientName,
      type,
      details,
      urgency,
      status: type === 'After hours' ? 'Call initiated' : (isHourly ? 'Pending sync' : 'New'),
      synced: !isHourly,
      syncedTime: isHourly ? undefined : exactTime,
      isNewArrival: true,
    };

    const updated = [newRow, ...state.requests];
    set({ requests: updated });
    saveRequests(updated);

    // If realtime mode, simulate sync checkmark transition
    if (!isHourly) {
      setTimeout(() => {
        set((current) => {
          const list = current.requests.map((r) =>
            r.id === newRow.id ? { ...r, isNewArrival: false, synced: true, syncedTime: exactTime } : r
          );
          saveRequests(list);
          return { requests: list };
        });
      }, 750);
    }

    return ref;
  },

  runHourlySync: () => {
    const now = new Date();
    const exactTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    set((current) => {
      const list = current.requests.map((r) =>
        !r.synced
          ? {
              ...r,
              synced: true,
              syncedTime: exactTime,
              status: (r.status === 'Pending sync' ? 'New' : r.status) as any,
              isNewArrival: true,
            }
          : r
      );
      saveRequests(list);
      return { requests: list };
    });

    // clear highlight
    setTimeout(() => {
      set((current) => ({
        requests: current.requests.map((r) => ({ ...r, isNewArrival: false })),
      }));
    }, 1600);
  },

  resetRequests: () => {
    sessionStorage.removeItem(STORAGE_KEY);
    const initial = seedData as ClinicalRequest[];
    set({
      requests: initial,
      nextRefNumber: { refill: 20413, doc: 3187, afterHours: 175 },
    });
  },

  exportCsvBlob: () => {
    const list = get().requests;
    const headers = ['Timestamp (ET)', 'Reference', 'Client Code', 'Client Name', 'Type', 'Details', 'Urgency', 'Status', 'Synced At'];
    const rows = list.map((r) => [
      `"${r.timestamp}"`,
      `"${r.ref}"`,
      `"${r.client}"`,
      `"${r.clientName}"`,
      `"${r.type}"`,
      `"${r.details.replace(/"/g, '""')}"`,
      `"${r.urgency}"`,
      `"${r.status}"`,
      `"${r.synced ? (r.syncedTime || 'Synced') : 'Pending'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  },
}));
