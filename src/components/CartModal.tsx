"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CartModal({ open, onClose }: Props) {
  // Lock body scroll & close on Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
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
      aria-label="Shopping cart"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Full-screen panel */}
      <div
        className={`relative h-full w-full bg-white flex flex-col transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-4"
        }`}
      >
        {/* Top bar */}
        <div className="container-x flex items-center justify-between h-20 border-b border-[var(--border)]">
          <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wider">
            Your Cart
            <span className="ml-2 text-sm font-normal tracking-normal text-[var(--muted-fg)]">
              (0 items)
            </span>
          </h2>
          <button
            onClick={onClose}
            className="icon-btn"
            aria-label="Close cart"
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
        <div className="container-x flex-1 overflow-y-auto flex items-center justify-center text-center py-10">
          <div className="max-w-md mx-auto flex flex-col items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[var(--bg-alt,#f7f7f7)] flex items-center justify-center text-[var(--muted-fg)]">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M3 4h2l2.5 12.5A2 2 0 0 0 9.46 18H18a2 2 0 0 0 2-1.6L21.5 8H6" />
                <circle cx="9" cy="21" r="1.4" />
                <circle cx="18" cy="21" r="1.4" />
              </svg>
            </div>
            <h3 className="font-serif text-lg font-bold uppercase tracking-wider">
              Your cart is empty
            </h3>
            <p className="text-sm text-[var(--muted-fg)]">
              Looks like you haven&apos;t added anything yet. Start exploring
              our collections to find pieces you&apos;ll love.
            </p>
            <button
              onClick={onClose}
              className="btn-primary mt-2"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Footer (always visible, ready for when items exist) */}
        <div className="container-x border-t border-[var(--border)] py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-[var(--muted-fg)]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M3 7h13l-1.5 8H6L4 4H1" />
              <circle cx="8" cy="20" r="1.4" />
              <circle cx="16" cy="20" r="1.4" />
            </svg>
            <span>Free delivery on all Lebanon</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[var(--muted-fg)]">Subtotal</span>
            <span className="font-serif font-bold text-base">$0.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
