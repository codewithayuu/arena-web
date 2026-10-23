export const MAX_DRAFT_ENTRIES = 256;
export const MAX_DRAFT_TOTAL_BYTES = 1_500_000;
const MAX_SOURCE_BYTES = 200_000;

export type ContestDraftStorage = Pick<Storage, "getItem" | "setItem">;

export function isBoundedContestSource(source: string): boolean {
  return source.length <= MAX_SOURCE_BYTES && new TextEncoder().encode(source).byteLength <= MAX_SOURCE_BYTES;
}

export function isContestDraftReady(
  loadedStorageKey: string | null,
  expectedStorageKey: string | null,
  activeDraftKey: string,
  expectedDraftKey: string,
): boolean {
  return expectedStorageKey !== null && loadedStorageKey === expectedStorageKey &&
    activeDraftKey === expectedDraftKey;
}

export function readContestDrafts(storage: ContestDraftStorage | null, key: string): Record<string, string> {
  if (!storage) return {};
  try {
    const raw = storage.getItem(key);
    if (!raw || new TextEncoder().encode(raw).byteLength > MAX_DRAFT_TOTAL_BYTES * 2) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const entries = Object.entries(parsed as Record<string, unknown>)
      .filter((entry): entry is [string, string] =>
        entry[0].length <= 128 && typeof entry[1] === "string" && isBoundedContestSource(entry[1]))
      .slice(-MAX_DRAFT_ENTRIES);
    return boundContestDrafts(Object.fromEntries(entries));
  } catch {
    return {};
  }
}

export function boundContestDrafts(values: Record<string, string>): Record<string, string> {
  const kept: Array<[string, string]> = [];
  let totalBytes = 0;
  for (const [key, source] of Object.entries(values).slice(-MAX_DRAFT_ENTRIES).reverse()) {
    if (!isBoundedContestSource(source)) continue;
    const bytes = new TextEncoder().encode(key).byteLength + new TextEncoder().encode(source).byteLength;
    if (totalBytes + bytes > MAX_DRAFT_TOTAL_BYTES) continue;
    kept.push([key, source]);
    totalBytes += bytes;
  }
  return Object.fromEntries(kept.reverse());
}

export function writeContestDrafts(
  storage: ContestDraftStorage | null,
  key: string,
  values: Record<string, string>,
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(key, JSON.stringify(boundContestDrafts(values)));
    return true;
  } catch {
    // Storage may be disabled or full. The caller keeps the editor usable and
    // can tell the participant that this draft is not durable.
    return false;
  }
}
