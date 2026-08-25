"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, SlidersHorizontal } from "lucide-react";
import CarCard from "../../components/CarCard";
import type { Product } from "../../lib/productPricing";
import { useInfiniteList } from "../../lib/useInfiniteList";
import { getJson } from "../../lib/apiFetch";

interface Factory {
  _id: string;
  name: string;
  img?: string[];
}

const LIMIT = 12;

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [factories, setFactories] = useState<Factory[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const selectedCats = searchParams.getAll("cat");
  const filter = searchParams.get("filter") || "";

  // The serialized URL params double as the cache key for the infinite list —
  // any filter change produces a new key and triggers a fresh load.
  const queryKey = searchParams.toString();

  const {
    items: products,
    loading,
    loadingMore,
    hasMore,
    totalItems,
    sentinelRef,
    loadMore,
  } = useInfiniteList<Product>("/api/productsz1", queryKey, LIMIT);

  // Sidebar categories
  useEffect(() => {
    getJson<Factory[]>("/api/factory").then((d) =>
      setFactories(Array.isArray(d) ? d : [])
    );
  }, []);

  const updateUrl = useCallback(
    (next: { cat?: string[]; filter?: string | null }) => {
      const params = new URLSearchParams();
      const cats = next.cat ?? selectedCats;
      cats.forEach((c) => params.append("cat", c));
      const f = next.filter !== undefined ? next.filter : filter;
      if (f) params.set("filter", f);
      const qs = params.toString();
      router.push(qs ? `/shop?${qs}` : "/shop");
    },
    [router, selectedCats, filter]
  );

  const toggleCat = (name: string) => {
    const set = new Set(selectedCats);
    if (set.has(name)) set.delete(name);
    else set.add(name);
    updateUrl({ cat: Array.from(set) });
  };

  const setFilter = (f: string) => {
    updateUrl({ filter: filter === f ? null : f });
  };

  const Sidebar = (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-4">Quick Filters</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setFilter("new")}
            className={`text-left text-sm transition ${filter === "new" ? "text-[var(--accent-dark)] font-semibold" : "text-[var(--muted-fg)] hover:text-[var(--foreground)]"}`}
          >
            New Arrivals
          </button>
          <button
            onClick={() => setFilter("sale")}
            className={`text-left text-sm transition ${filter === "sale" ? "text-[var(--accent-dark)] font-semibold" : "text-[var(--muted-fg)] hover:text-[var(--foreground)]"}`}
          >
            On Sale
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-4">Categories</h3>
        <div className="flex flex-col gap-2.5">
          {factories.map((f) => (
            <label key={f._id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCats.includes(f.name)}
                onChange={() => toggleCat(f.name)}
                className="w-4 h-4 accent-[var(--accent)]"
              />
              <span className="text-sm capitalize text-[var(--muted-fg)] group-hover:text-[var(--foreground)] transition">
                {f.name.toLowerCase()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {(selectedCats.length > 0 || filter) && (
        <button onClick={() => router.push("/shop")} className="text-sm text-[var(--accent-dark)] underline">
          Clear all filters
        </button>
      )}
    </div>
  );

  const activeCount = selectedCats.length + (filter ? 1 : 0);

  return (
    <div className="container-x py-10 lg:py-14">
      {/* Minimal toolbar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[var(--muted-fg)]">
          {loading ? "\u00A0" : `${totalItems} products`}
        </p>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFiltersOpen((v) => !v)}
          aria-expanded={mobileFiltersOpen}
          className="lg:hidden inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground)]"
        >
          <SlidersHorizontal size={16} strokeWidth={1.8} />
          Filters
          {activeCount > 0 && (
            <span className="text-[var(--accent-dark)]">({activeCount})</span>
          )}
        </button>
      </div>

      {/* Mobile filter panel */}
      {mobileFiltersOpen && (
        <div className="lg:hidden mb-8 border-t border-b border-[var(--border)] py-6">
          {Sidebar}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        <aside className="hidden lg:block">{Sidebar}</aside>

        <div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full rounded-md bg-[#eee]" style={{ aspectRatio: "3 / 4" }} />
                  <div className="h-4 bg-[#eee] rounded mt-3 w-3/4" />
                  <div className="h-4 bg-[#eee] rounded mt-2 w-1/4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center text-[var(--muted-fg)]">
              No products found. Try adjusting your filters.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-8">
                {products.map((p) => (
                  <CarCard key={p._id} temp={p} showNewBadge={false} showBestSellerBadge={false} />
                ))}
              </div>

              {/* Sentinel — observed by useInfiniteList to auto-load on scroll. */}
              <div ref={sentinelRef} aria-hidden="true" className="h-px w-full mt-8" />

              {loadingMore && (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-[var(--muted-fg)]">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Loading more…</span>
                </div>
              )}

              {!loadingMore && hasMore && (
                <div className="flex justify-center py-6">
                  <button
                    onClick={loadMore}
                    className="text-xs font-bold tracking-[0.2em] uppercase border border-[var(--border)] hover:border-[var(--accent)] px-6 py-3 rounded-md transition"
                  >
                    Load more
                  </button>
                </div>
              )}

              {!hasMore && !loadingMore && products.length >= LIMIT && (
                <p className="py-8 text-center text-xs uppercase tracking-[0.2em] text-[var(--muted-fg)]">
                  You&rsquo;ve reached the end
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-x py-20 text-center text-[var(--muted-fg)]">Loading…</div>}>
      <ShopContent />
    </Suspense>
  );
}
