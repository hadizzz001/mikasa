// Meta (Facebook) Pixel — https://developers.facebook.com/docs/meta-pixel
//
// The official base code is bootstrapped lazily on the first call, so events
// fired early in hydration are queued by the `fbq` stub instead of being lost,
// and every helper is a no-op on the server. PageView is fired manually on each
// App Router navigation by components/MetaPixel.tsx.

import { AUTH_STORAGE_KEY, type AuthUser } from "../context/AuthContext";
import { getCategories, getEffectivePrice, type Product } from "./productPricing";

// Set NEXT_PUBLIC_META_PIXEL_ID to override, or to an empty string to disable.
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1650172650229435";

const CURRENCY = "USD";
const FBEVENTS_SRC = "https://connect.facebook.net/en_US/fbevents.js";

export type StandardEvent =
  | "PageView"
  | "ViewContent"
  | "Search"
  | "CustomizeProduct"
  | "AddToCart"
  | "AddToWishlist"
  | "InitiateCheckout"
  | "Purchase"
  | "CompleteRegistration"
  | "Contact";

export type EventParams = Record<string, unknown>;

interface Fbq {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
  disablePushState?: boolean;
  allowDuplicatePageViews?: boolean;
}

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let initialised = false;

// TypeScript port of Meta's base code snippet: installs the queuing `fbq` stub
// and loads fbevents.js asynchronously.
function installBaseCode(): Fbq {
  if (window.fbq) return window.fbq;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = FBEVENTS_SRC;
  document.head.appendChild(script);

  return fbq;
}

// Manual advanced matching for signed-in customers improves event match
// quality. The pixel SHA-256 hashes the email before it leaves the browser.
function storedCustomer(): Record<string, string> | undefined {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    const user = raw ? (JSON.parse(raw) as AuthUser) : null;
    if (!user?.email) return undefined;
    return { em: user.email.trim().toLowerCase(), external_id: String(user._id) };
  } catch {
    return undefined;
  }
}

function getFbq(): Fbq | undefined {
  if (typeof window === "undefined" || !META_PIXEL_ID) return undefined;
  if (!initialised) {
    initialised = true;
    const fbq = installBaseCode();
    // PageView is tracked manually on every client-side navigation, so turn
    // off the pixel's own History API listener to avoid double counting.
    fbq.disablePushState = true;
    fbq.allowDuplicatePageViews = true;
    const customer = storedCustomer();
    if (customer) fbq("init", META_PIXEL_ID, customer);
    else fbq("init", META_PIXEL_ID);
  }
  return window.fbq;
}

// Drop empty values so they aren't sent as "undefined" strings.
const clean = (params: EventParams = {}): EventParams =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );

function send(
  method: "track" | "trackCustom",
  event: string,
  params?: EventParams,
  eventId?: string
) {
  const fbq = getFbq();
  if (!fbq) return;
  const data = clean(params);
  if (eventId) fbq(method, event, data, { eventID: eventId });
  else fbq(method, event, data);
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[Meta Pixel] ${event}`, data);
  }
}

/** Fire one of Meta's standard events. `eventId` deduplicates repeats. */
export const track = (event: StandardEvent, params?: EventParams, eventId?: string) =>
  send("track", event, params, eventId);

/** Fire a custom (non-standard) event. */
export const trackCustom = (event: string, params?: EventParams, eventId?: string) =>
  send("trackCustom", event, params, eventId);

export const pageView = () => track("PageView");

const round = (n: number) => Math.round(n * 100) / 100;

/** Event parameters for a single product (optionally a colour/size variant). */
export function productParams(
  product: Product,
  { quantity = 1, color, size }: { quantity?: number; color?: string; size?: string } = {}
): EventParams {
  const { price } = getEffectivePrice(product, color, size);
  return {
    content_ids: [product._id],
    content_name: product.title,
    content_category: getCategories(product).join(", "),
    content_type: "product",
    contents: [{ id: product._id, quantity, item_price: price }],
    value: round(price * quantity),
    currency: CURRENCY,
  };
}

/** Event parameters for a set of cart lines (checkout / purchase). */
export function cartParams(lines: Product[]): EventParams {
  const contents = lines.map((line) => ({
    id: line._id,
    quantity: line.quantity || 1,
    item_price: getEffectivePrice(line, line.selectedColor, line.selectedSize).price,
  }));
  return {
    content_ids: Array.from(new Set(contents.map((c) => c.id))),
    content_type: "product",
    contents,
    num_items: contents.reduce((n, c) => n + c.quantity, 0),
    value: round(contents.reduce((sum, c) => sum + c.item_price * c.quantity, 0)),
    currency: CURRENCY,
  };
}
