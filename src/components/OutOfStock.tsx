"use client";

// WhatsApp pre-order prompt shown when an item is out of stock.
const WHATSAPP_NUMBER = "96176987808";

export default function OutOfStock({ itemName }: { itemName?: string }) {
  const message = `I want to preorder this item: ${itemName || ""}`.trim();
  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg font-bold text-[var(--foreground)] uppercase tracking-wide">
        Out of Stock
      </p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.55 0 .22 5.32.22 11.86c0 2.09.55 4.13 1.58 5.93L.12 24l6.36-1.67a11.85 11.85 0 0 0 5.6 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.14-3.43-8.42Z" />
        </svg>
        Preorder on WhatsApp
      </a>
    </div>
  );
}
