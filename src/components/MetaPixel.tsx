"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { META_PIXEL_ID, pageView, track } from "../lib/metaPixel";

// Fires PageView on first load and on every client-side navigation. Search
// params are part of the URL because product pages are /product?id=….
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrl = useRef<string | null>(null);

  useEffect(() => {
    const url = `${pathname}?${searchParams.toString()}`;
    // Guards against the dev-only Strict Mode double effect.
    if (lastUrl.current === url) return;
    lastUrl.current = url;
    pageView();
  }, [pathname, searchParams]);

  return null;
}

const contactMethod = (href: string) => {
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|(www\.)?whatsapp\.com)\//i.test(href)) {
    return "whatsapp";
  }
  if (href.startsWith("mailto:")) return "email";
  if (href.startsWith("tel:")) return "phone";
  return null;
};

// One delegated listener tracks every WhatsApp / email / phone link on the
// site, including ones rendered by server components. Links can set
// `data-pixel-label` to describe themselves in the event.
function useContactTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link =
        e.target instanceof Element ? e.target.closest<HTMLAnchorElement>("a[href]") : null;
      const method = link ? contactMethod(link.href) : null;
      if (!link || !method) return;
      const label =
        link.dataset.pixelLabel || link.getAttribute("aria-label") || link.textContent || "";
      track("Contact", { contact_method: method, content_name: label.trim().slice(0, 100) });
    };
    // Capture phase so handlers that stop propagation don't hide the click.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
}

export default function MetaPixel() {
  useContactTracking();

  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
