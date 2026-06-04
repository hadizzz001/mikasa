"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CarCard from "../../components/CarCard";
import Pagination from "../../components/Pagination";
import type { Product } from "../../lib/productPricing";

const LIMIT = 12;

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const cats = searchParams.getAll("cat");
  const filter = searchParams.get("filter") || "";
  const minoff = searchParams.get("minoff") || "";
  const pct = searchParams.get("pct") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const hasCriteria = !!q || cats.length > 0 || !!filter || !!minoff || !!pct;

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(LIMIT));
    if (q) params.set("q", q);
    cats.forEach((c) => params.append("cat", c));
    if (filter) params.set("filter", filter);
    if (minoff) params.set("minoff", minoff);
    if (pct) params.set("pct", pct);

    fetch(`/api/productsz1?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setTotalPages(d.totalPages || 1);
        setTotalItems(d.totalItems || 0);
      })
      .catch(() => {
        setProducts([]);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const goPage = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    cats.forEach((c) => params.append("cat", c));
    if (filter) params.set("filter", filter);
    if (minoff) params.set("minoff", minoff);
    if (pct) params.set("pct", pct);
    if (p > 1) params.set("page", String(p));
    router.push(`/search?${params.toString()}`);
  };

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
              <CarCard key={p._id} temp={p} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onChange={goPage} />
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
