"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const popularSearches = [
  "Pillows",
  "Vases",
  "Candles",
  "Mugs",
  "Storage Baskets",
  "Bedding",
  "Wall Decor",
  "Kitchen",
];

export default function SearchModal({ open, onClose }: Props) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll & focus input
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[80] transition-opacity duration-200 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/95 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative h-full w-full flex flex-col transition-transform duration-300 ${
          open ? "translate-y-0" : "-translate-y-4"
        }`}
      >
        {/* Top bar */}
        <div className="container-x flex items-center gap-3 h-20 border-b border-[var(--border)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex-1 flex items-center gap-3"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="text-[var(--muted-fg)] shrink-0"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for products, brands, categories…"
              className="flex-1 bg-transparent outline-none text-base sm:text-lg placeholder:text-[var(--muted-fg)]"
            />
          </form>
          <button
            onClick={onClose}
            className="icon-btn"
            aria-label="Close search"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="container-x flex-1 overflow-y-auto py-10">
          <p className="text-[0.7rem] tracking-[0.25em] uppercase text-[var(--muted-fg)] mb-4">
            Popular Searches
          </p>
          <div className="flex flex-wrap gap-2.5">
            {popularSearches.map((s) => (
              <button
                key={s}
                onClick={() => setQ(s)}
                className="px-4 py-2 text-sm border border-[var(--border)] rounded-[var(--radius)] hover:border-[var(--accent)] hover:text-[var(--accent-dark)] transition"
              >
                {s}
              </button>
            ))}
          </div>

          {q.trim().length > 0 && (
            <div className="mt-10">
              <p className="text-[0.7rem] tracking-[0.25em] uppercase text-[var(--muted-fg)] mb-4">
                Results
              </p>
              <p className="text-sm text-[var(--muted-fg)]">
                No results yet for &ldquo;{q}&rdquo;. Try one of the popular
                searches above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
