"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CarCard from "../../components/CarCard";
import Pagination from "../../components/Pagination";
import type { Product } from "../../lib/productPricing";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const selectedCats = searchParams.getAll("cat");
  const filter = searchParams.get("filter") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Sidebar categories
  useEffect(() => {
    fetch("/api/factory")
      .then((r) => r.json())
      .then((d) => setFactories(Array.isArray(d) ? d : []))
      .catch(() => setFactories([]));
  }, []);

  // Product listing
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(LIMIT));
    selectedCats.forEach((c) => params.append("cat", c));
    if (filter) params.set("filter", filter);

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

  const updateUrl = useCallback(
    (next: { cat?: string[]; filter?: string | null; page?: number }) => {
      const params = new URLSearchParams();
      const cats = next.cat ?? selectedCats;
      cats.forEach((c) => params.append("cat", c));
      const f = next.filter !== undefined ? next.filter : filter;
      if (f) params.set("filter", f);
      const p = next.page ?? 1;
      if (p > 1) params.set("page", String(p));
      router.push(`/shop?${params.toString()}`);
    },
    [router, selectedCats, filter]
  );

  const toggleCat = (name: string) => {
    const set = new Set(selectedCats);
    if (set.has(name)) set.delete(name);
    else set.add(name);
    updateUrl({ cat: Array.from(set), page: 1 });
  };

  const setFilter = (f: string) => {
    updateUrl({ filter: filter === f ? null : f, page: 1 });
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

  return (
    <div className="container-x py-10 lg:py-14">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-xs tracking-[0.25em] uppercase text-[var(--muted-fg)] mb-2">Sana Home</p>
        <h1 className="font-serif text-3xl lg:text-4xl font-bold uppercase tracking-wide">Shop All</h1>
        {!loading && (
          <p className="mt-2 text-sm text-[var(--muted-fg)]">{totalItems} products</p>
        )}
      </div>

      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-5">
        <button
          onClick={() => setMobileFiltersOpen((v) => !v)}
          className="w-full btn-primary"
        >
          {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
        </button>
        {mobileFiltersOpen && <div className="mt-5 border-t border-[var(--border)] pt-5">{Sidebar}</div>}
      </div>

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
                  <CarCard key={p._id} temp={p} />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onChange={(p) => updateUrl({ page: p })}
              />
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
