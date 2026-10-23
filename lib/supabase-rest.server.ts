import "server-only";

export function supabaseRestUrl(table: string): URL {
  if (!/^[a-z][a-z0-9_]*$/.test(table)) throw new Error("Invalid table name");
  const raw = process.env.SUPABASE_URL;
  if (!raw) throw new Error("Supabase is not configured");
  const base = new URL(raw);
  if (
    base.protocol !== "https:" ||
    base.username ||
    base.password ||
    base.search ||
    base.hash ||
    !["", "/"].includes(base.pathname)
  ) {
    throw new Error("Supabase configuration is invalid");
  }
  base.pathname = `/rest/v1/${table}`;
  return base;
}

export function supabaseRpcUrl(functionName: string): URL {
  if (!/^[a-z][a-z0-9_]*$/.test(functionName)) throw new Error("Invalid RPC function name");
  const raw = process.env.SUPABASE_URL;
  if (!raw) throw new Error("Supabase is not configured");
  const base = new URL(raw);
  if (base.protocol !== "https:" || base.username || base.password || base.search || base.hash || !["", "/"].includes(base.pathname)) {
    throw new Error("Supabase configuration is invalid");
  }
  base.pathname = `/rest/v1/rpc/${functionName}`;
  return base;
}

export function supabaseServiceHeaders(extra: HeadersInit = {}): Headers {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("Supabase is not configured");
  const headers = new Headers(extra);
  headers.set("apikey", serviceKey);
  headers.set("authorization", `Bearer ${serviceKey}`);
  return headers;
}

export async function supabaseRequest(
  url: URL,
  init: RequestInit,
): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: supabaseServiceHeaders(init.headers),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
}

export async function supabaseReadAll<T>(url: URL, pageSize = 1000): Promise<T[]> {
  const rows: T[] = [];
  for (let offset = 0; offset < 100_000; offset += pageSize) {
    const pageUrl = new URL(url);
    const params = new URLSearchParams(pageUrl.search);
    params.set("limit", String(pageSize));
    params.set("offset", String(offset));
    pageUrl.search = params.toString();
    const response = await supabaseRequest(pageUrl, { method: "GET" });
    if (!response.ok) throw new Error("Supabase query failed");
    const page = await response.json() as T[];
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }
  throw new Error("Supabase query exceeded pagination safety limit");
}

export async function getSupabaseProfileId(clerkUserId: string): Promise<string | null> {
  const url = supabaseRestUrl("profiles");
  url.search = new URLSearchParams({
    select: "id",
    clerk_user_id: `eq.${clerkUserId}`,
    limit: "1",
  }).toString();
  const response = await supabaseRequest(url, { method: "GET" });
  if (!response.ok) throw new Error("Profile lookup failed");
  const rows = (await response.json()) as Array<{ id: string }>;
  return rows[0]?.id ?? null;
}
