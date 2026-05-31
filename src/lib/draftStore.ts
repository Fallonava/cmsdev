/**
 * In-memory draft store for Live Preview feature.
 * Stores temporary unsaved settings per session token.
 * Resets on server restart — intentional, preview data is ephemeral.
 */

type DraftEntry = {
  settings: any;
  media: any;
  updatedAt: number;
};

const store = new Map<string, DraftEntry>();

// Auto-cleanup entries older than 2 hours
function cleanup() {
  const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
  for (const [key, value] of store.entries()) {
    if (value.updatedAt < twoHoursAgo) store.delete(key);
  }
}

export function setDraft(token: string, entry: Omit<DraftEntry, "updatedAt">) {
  cleanup();
  store.set(token, { ...entry, updatedAt: Date.now() });
}

export function getDraft(token: string): DraftEntry | null {
  return store.get(token) ?? null;
}

export function clearDraft(token: string) {
  store.delete(token);
}
