"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Hide only once the last request has been quiet for this long, so the screen
// doesn't flash between two sections loading one after the other.
const SETTLE_MS = 250;
// Hard cap: never keep the screen covered longer than this, whatever happens.
const MAX_MS = 8000;

/**
 * Full-screen loading screen.
 *
 * The storefront loads all of its content from /api/* inside the components,
 * so the page exists long before it has anything to show. This covers the
 * screen with a white background and a spinner from the first paint until the
 * document AND its initial data requests have finished, then gets out of the
 * way — later background requests (infinite scroll, add to cart, promo codes)
 * never bring it back.
 */
export default function PageLoader() {
  const pathname = usePathname();
  // The path we have already finished loading. Anything else is still loading,
  // so a navigation shows the screen again without a setState in the effect.
  const [settledPath, setSettledPath] = useState<string | null>(null);
  const visible = settledPath !== pathname;

  useEffect(() => {
    let pending = 0;
    let done = false;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;

    const hide = () => {
      if (done) return;
      done = true;
      setSettledPath(pathname);
    };

    // Called whenever things go quiet; only hides if they stay quiet.
    const scheduleHide = () => {
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        if (pending === 0) hide();
      }, SETTLE_MS);
    };

    const onLoad = () => scheduleHide();
    window.addEventListener("load", onLoad);
    if (document.readyState === "complete") scheduleHide();

    // Count in-flight requests by wrapping fetch. The original is called
    // untouched (bound to window so browsers accept the detached call) and put
    // back on cleanup, so nothing about fetch behaviour changes.
    const originalFetch = window.fetch;
    const boundFetch = originalFetch.bind(window);
    window.fetch = ((...args: Parameters<typeof fetch>) => {
      if (!done) {
        pending += 1;
        if (settleTimer) {
          clearTimeout(settleTimer);
          settleTimer = null;
        }
      }
      return boundFetch(...args).finally(() => {
        if (done) return;
        pending = Math.max(0, pending - 1);
        if (pending === 0) scheduleHide();
      });
    }) as typeof window.fetch;

    const cap = setTimeout(hide, MAX_MS);

    return () => {
      window.removeEventListener("load", onLoad);
      window.fetch = originalFetch;
      if (settleTimer) clearTimeout(settleTimer);
      clearTimeout(cap);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="page-loader__spinner" aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
