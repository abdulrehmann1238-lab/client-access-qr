import { useSimulate } from '../store/useSimulate';
import { useRequests } from '../store/useRequests';
import { useSession } from '../store/useSession';
import guidesData from '../data/guides.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function simulateLatency() {
  const { slowNetwork } = useSimulate.getState();
  if (slowNetwork) {
    await delay(3000);
  } else {
    // 500ms to 1200ms
    const ms = 500 + Math.floor(Math.random() * 700);
    await delay(ms);
  }
}

export const mockApi = {
  async verifyPasscode(code: string) {
    await simulateLatency();
    const result = useSession.getState().verifyPasscode(code);
    if (result.success) {
      useSimulate.getState().markChecklist('unlockedPasscode');
    }
    return result;
  },

  async submitRefill(payload: {
    client: string;
    clientName: string;
    medications: string[];
    deliveryPreference: string;
    pharmacy: string;
    preferredDate: string;
    notes?: string;
  }) {
    await simulateLatency();
    const { forceError } = useSimulate.getState();
    if (forceError) {
      throw new Error('We could not send your request. Our clinical gateway rejected the transmission.');
    }

    const medSummary = payload.medications.join(', ');
    const details = `${medSummary}; ${payload.deliveryPreference} (${payload.pharmacy})${payload.preferredDate ? ` - Pref: ${payload.preferredDate}` : ''}${payload.notes ? ` - Note: "${payload.notes}"` : ''}`;

    const ref = useRequests.getState().addRequest({
      client: payload.client,
      clientName: payload.clientName,
      type: 'Refill',
      details,
      urgency: 'Normal',
    });

    useSimulate.getState().markChecklist('submittedForm');
    return { success: true, ref };
  },

  async submitDocuments(payload: {
    client: string;
    clientName: string;
    documentTypes: string[];
    deliveryMethod: string;
    deliveryDetails?: string;
    notes?: string;
  }) {
    await simulateLatency();
    const { forceError } = useSimulate.getState();
    if (forceError) {
      throw new Error('Failed to record document request. Please call our clinical care coordinator.');
    }

    const typeSummary = payload.documentTypes.join(', ');
    const details = `${typeSummary}; ${payload.deliveryMethod}${payload.deliveryDetails ? ` (${payload.deliveryDetails})` : ''}${payload.notes ? ` - "${payload.notes}"` : ''}`;

    const ref = useRequests.getState().addRequest({
      client: payload.client,
      clientName: payload.clientName,
      type: 'Documents',
      details,
      urgency: 'Normal',
    });

    useSimulate.getState().markChecklist('submittedForm');
    return { success: true, ref };
  },

  async submitAfterHours(payload: {
    client: string;
    clientName: string;
    callerName: string;
    callbackNumber: string;
    recipient: string;
    urgency: 'Question' | 'Needs attention soon' | 'Urgent';
    summary: string;
  }) {
    // Latency for recording the call
    await delay(350);
    const { forceError } = useSimulate.getState();

    const details = `${payload.summary}; Caller: ${payload.callerName} (${payload.recipient}), Tel: ${payload.callbackNumber}`;

    if (forceError) {
      // Safety first: in after-hours, even if recording fails, clinical safety requires letting the call proceed
      return { 
        success: false, 
        fallbackProceedToCall: true,
        error: "We couldn't save your details, but you can still call." 
      };
    }

    const ref = useRequests.getState().addRequest({
      client: payload.client,
      clientName: payload.clientName,
      type: 'After hours',
      details,
      urgency: payload.urgency,
    });

    useSimulate.getState().markChecklist('tappedCall');
    useSimulate.getState().markChecklist('submittedForm');
    return { success: true, ref, fallbackProceedToCall: true };
  },

  async getGuides() {
    await delay(300);
    return guidesData;
  },

  async getGuideById(id: string) {
    await delay(200);
    useSimulate.getState().markChecklist('openedPdf');
    return guidesData.find((g) => g.id === id) || null;
  }
};
