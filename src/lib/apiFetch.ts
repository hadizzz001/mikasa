/**
 * Client-side JSON GET with retries.
 *
 * Every storefront section loads its own content from /api/*, and a section
 * that fails to load renders nothing at all. A single hiccup — a cold database
 * connection, a dropped socket, one route being slow while a dozen sections
 * request at once — used to leave that section blank until the visitor
 * refreshed the page, because nothing ever retried.
 *
 * `getJson` retries a few times with a short backoff before giving up, and
 * returns `null` instead of throwing so call sites keep their own fallbacks.
 *
 * READ-ONLY. Never use it for requests that change data (orders, stock,
 * login/register) — a retry there could perform the action twice.
 */
export async function getJson<T>(
  url: string,
  { retries = 2, retryDelayMs = 400 }: { retries?: number; retryDelayMs?: number } = {}
): Promise<T | null> {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`${url} responded with ${res.status}`);
      return (await res.json()) as T;
    } catch (error) {
      if (attempt === retries) {
        console.warn(`[getJson] gave up on ${url}:`, error);
        return null;
      }
      // Linear backoff: 400ms, then 800ms.
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs * (attempt + 1)));
    }
  }
  return null;
}
