"use client";

interface Props {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

// Compact sliding pagination: first/prev, a window of pages, next/last.
export default function Pagination({ currentPage, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const windowSize = 5;
  let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const go = (p: number) => {
    if (p >= 1 && p <= totalPages && p !== currentPage) onChange(p);
  };

  const btn =
    "min-w-9 h-9 px-3 inline-flex items-center justify-center rounded-md border text-sm transition disabled:opacity-40";

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
      <button onClick={() => go(currentPage - 1)} disabled={currentPage === 1} className={`${btn} border-[var(--border)] hover:border-[var(--accent)]`}>
        ‹
      </button>
      {start > 1 && (
        <>
          <button onClick={() => go(1)} className={`${btn} border-[var(--border)] hover:border-[var(--accent)]`}>1</button>
          {start > 2 && <span className="px-1 text-[var(--muted-fg)]">…</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => go(p)}
          className={`${btn} ${
            p === currentPage
              ? "bg-[var(--accent)] border-[var(--accent)] text-black font-bold"
              : "border-[var(--border)] hover:border-[var(--accent)]"
          }`}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-[var(--muted-fg)]">…</span>}
          <button onClick={() => go(totalPages)} className={`${btn} border-[var(--border)] hover:border-[var(--accent)]`}>
            {totalPages}
          </button>
        </>
      )}
      <button onClick={() => go(currentPage + 1)} disabled={currentPage === totalPages} className={`${btn} border-[var(--border)] hover:border-[var(--accent)]`}>
        ›
      </button>
    </nav>
  );
}
