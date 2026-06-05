"use client";

import { useEffect, useState } from "react";

type CategoryRow = {
  id?: string;
  name: string;
  img?: string[];
  sort?: number | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CategoriesModal({ open, onClose }: Props) {
  const [cats, setCats] = useState<CategoryRow[]>([]);

  // Load categories from the API and honour the admin-defined sort order.
  useEffect(() => {
    let active = true;
    fetch("/api/category")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: CategoryRow[]) => {
        if (!active || !Array.isArray(data)) return;
        setCats(
          [...data].sort(
            (a, b) =>
              (a.sort ?? Number.MAX_SAFE_INTEGER) -
              (b.sort ?? Number.MAX_SAFE_INTEGER)
          )
        );
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

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
      aria-label="All categories"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Full-screen panel */}
      <div
        className={`relative h-full w-full bg-white flex flex-col transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-4"
        }`}
      >
        {/* Top bar */}
        <div className="container-x flex items-center justify-between h-20 border-b border-[var(--border)]">
          <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wider">
            All Categories
          </h2>
          <button onClick={onClose} className="icon-btn" aria-label="Close categories">
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
        <div className="container-x flex-1 overflow-y-auto py-6">
          <ul className="max-w-2xl mx-auto divide-y divide-[var(--border)]">
            {cats.map((c) => (
              <li key={c.id ?? c.name}>
                <a
                  href={`/search?cat=${encodeURIComponent(c.name)}`}
                  onClick={onClose}
                  className="flex items-center justify-between py-4 group"
                >
                  <span className="text-base font-medium capitalize text-[var(--foreground)] group-hover:text-[var(--accent-dark)] transition-colors">
                    {c.name.toLowerCase()}
                  </span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="text-[var(--muted-fg)] group-hover:text-[var(--accent-dark)] transition-colors"
                  >
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
