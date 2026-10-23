const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type ContestLaunchIntent = {
  requestId: string;
  launchUri: string;
  expiresAt: number;
};

export function validateContestLaunchIntent(
  value: unknown,
  contestId: string,
  now = Date.now(),
): ContestLaunchIntent | null {
  if (value === null || typeof value !== "object" || Array.isArray(value) || !UUID.test(contestId)) return null;
  const intent = value as Record<string, unknown>;
  if (typeof intent.request_id !== "string" || !UUID.test(intent.request_id) ||
      intent.contest_id !== contestId ||
      intent.launch_uri !== `mindflare://contest/start?request_id=${intent.request_id}` ||
      typeof intent.expires_at !== "string") return null;
  const expiresAt = Date.parse(intent.expires_at);
  if (!Number.isFinite(expiresAt) || expiresAt <= now || expiresAt > now + 4 * 60_000) return null;
  return { requestId: intent.request_id, launchUri: intent.launch_uri, expiresAt };
}

/** Dispatch synchronously from a deliberate click so browser user activation
 * is still present when the OS custom URL handler is opened. */
export function dispatchContestLaunchIntent(
  intent: ContestLaunchIntent,
  now: number,
  open: (uri: string) => void,
): boolean {
  if (!UUID.test(intent.requestId) ||
      intent.launchUri !== `mindflare://contest/start?request_id=${intent.requestId}` ||
      !Number.isFinite(intent.expiresAt) || intent.expiresAt <= now || intent.expiresAt > now + 4 * 60_000) {
    return false;
  }
  open(intent.launchUri);
  return true;
}
