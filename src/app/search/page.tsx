"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import CarCard from "../../components/CarCard";
import type { Product } from "../../lib/productPricing";
import { useInfiniteList } from "../../lib/useInfiniteList";
import { track } from "../../lib/metaPixel";

const LIMIT = 12;

function SearchContent() {
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const cats = searchParams.getAll("cat");
  const filter = searchParams.get("filter") || "";
  const minoff = searchParams.get("minoff") || "";
  const pct = searchParams.get("pct") || "";
  const hasCriteria = !!q || cats.length > 0 || !!filter || !!minoff || !!pct;

  const lastSearch = useRef("");
  useEffect(() => {
    if (!q || q === lastSearch.current) return;
    lastSearch.current = q;
    track("Search", { search_string: q });
  }, [q]);

  // Serialized URL params double as the cache key for the infinite list.
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

  return (
    <div className="container-x py-10 lg:py-14">
      {hasCriteria && !loading && (
        <p className="text-center text-sm text-[var(--muted-fg)] mb-8">
          {totalItems} result{totalItems === 1 ? "" : "s"}
          {q && <> for &ldquo;{q}&rdquo;</>}
          {filter === "new" && <> in New Arrivals</>}
          {(filter === "best" || filter === "sale") && <> in Best Sellers</>}
          {minoff && <> in Offers (under ${minoff})</>}
          {pct && <> in Offers ({pct}% off)</>}
          {cats.length > 0 && (
            <span className="capitalize"> in {cats.join(", ").toLowerCase()}</span>
          )}
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full rounded-md bg-[#eee]" style={{ aspectRatio: "3 / 4" }} />
              <div className="h-4 bg-[#eee] rounded mt-3 w-3/4" />
            </div>
          ))}
        </div>
      ) : !hasCriteria ? (
        <p className="py-20 text-center text-[var(--muted-fg)]">Type something to start searching.</p>
      ) : products.length === 0 ? (
        <p className="py-20 text-center text-[var(--muted-fg)]">No products matched your search.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
            {products.map((p) => (
              <CarCard
                key={p._id}
                temp={p}
                showNewBadge={cats.length === 0 && !minoff && filter !== "best" && filter !== "sale"}
                showBestSellerBadge={cats.length === 0 && !minoff && filter !== "new"}
              />
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
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-x py-20 text-center text-[var(--muted-fg)]">Loading…</div>}>
      <SearchContent />
    </Suspense>
  );
}
