"use client";

import { useEffect, useState } from "react";

/**
 * Small, non-blocking loading indicator.
 *
 * The storefront loads its content from /api/* inside the components, so there
 * is always a short window where the page is up but its data is not. Instead of
 * hiding the page behind a full-screen overlay, this shows a spinner in the
 * corner while the document is still loading or while ANY fetch() is in flight —
 * the page itself stays visible the whole time.
 */
export default function PageLoader() {
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let pending = 0;
    let documentLoading = document.readyState !== "complete";
    const sync = () => setBusy(documentLoading || pending > 0);
    sync();

    const onLoad = () => {
      documentLoading = false;
      sync();
    };
    window.addEventListener("load", onLoad);

    // Count in-flight requests by wrapping fetch. The original implementation is
    // called untouched (bound to window so browsers accept the detached call)
    // and restored on unmount, so nothing else about fetch behaviour changes.
    const originalFetch = window.fetch;
    const boundFetch = originalFetch.bind(window);
    window.fetch = ((...args: Parameters<typeof fetch>) => {
      pending += 1;
      sync();
      return boundFetch(...args).finally(() => {
        pending = Math.max(0, pending - 1);
        sync();
      });
    }) as typeof window.fetch;

    return () => {
      window.removeEventListener("load", onLoad);
      window.fetch = originalFetch;
    };
  }, []);

  if (!busy) return null;

  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="page-loader__spinner" aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
