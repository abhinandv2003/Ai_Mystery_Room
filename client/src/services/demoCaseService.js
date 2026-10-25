import { sampleCase } from '../mocks/sampleCase.js';

// Demo-only persistence/evaluation. Replace this adapter with API calls in later phases.
const SESSION_KEY = 'amr:sample-investigation';
const VERDICT_KEY = 'amr:sample-verdict';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1';

const freshSession = () => ({ notes: '', selectedEvidence: [], updatedAt: null });

export const demoCaseService = {
  getCase() {
    return sampleCase;
  },
  getSession() {
    try {
      return { ...freshSession(), ...JSON.parse(localStorage.getItem(SESSION_KEY) ?? '{}') };
    } catch {
      return freshSession();
    }
  },
  saveSession(patch) {
    const next = { ...this.getSession(), ...patch, updatedAt: new Date().toISOString() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    return next;
  },
  async submitAccusation(suspectId, reasoning = '') {
    const response = await fetch(`${API_BASE_URL}/demo/sample/accusations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suspectId, reasoning }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.success) {
      throw new Error(payload.error?.message ?? 'The demo verdict could not be loaded.');
    }
    const verdict = payload.data;
    localStorage.setItem(VERDICT_KEY, JSON.stringify(verdict));
    return verdict;
  },
  getVerdict() {
    try {
      return JSON.parse(localStorage.getItem(VERDICT_KEY) ?? 'null');
    } catch {
      return null;
    }
  },
  reset() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(VERDICT_KEY);
  },
};
