"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import { getJson } from "../lib/apiFetch";
import CarCard from "./CarCard";
import type { Product } from "../lib/productPricing";

type CategoryRow = {
  id: string;
  name: string;
  img?: string[];
  sort?: number | null;
};

type CategoryWithProducts = {
  id: string;
  name: string;
  products: Product[];
};

// One row per category: 4 products on desktop (1 row) / 2 on mobile (2 rows).
const PER_CATEGORY = 4;

function ArrowRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function CategoryProductRows() {
  const [rows, setRows] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const cats = (await getJson<CategoryRow[]>("/api/category")) ?? [];
        if (!active || !Array.isArray(cats) || cats.length === 0) {
          if (active) setLoading(false);
          return;
        }

        // Fetch the first few products for every category in parallel.
        const settled = await Promise.all(
          cats.map(async (cat) => {
            try {
              const data = await getJson<{ products?: Product[] }>(
                `/api/productsz1?cat=${encodeURIComponent(
                  cat.name
                )}&page=1&limit=${PER_CATEGORY}`
              );
              const products: Product[] = Array.isArray(data?.products)
                ? data.products
                : [];
              return { id: cat.id, name: cat.name, products };
            } catch {
              return { id: cat.id, name: cat.name, products: [] as Product[] };
            }
          })
        );

        if (!active) return;
        // Only keep categories that actually have products to show.
        setRows(settled.filter((row) => row.products.length > 0));
      } catch {
        if (active) setRows([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="container-x py-6 lg:py-10">
        {Array.from({ length: 2 }).map((_, s) => (
          <section key={s} className="mb-12 lg:mb-16">
            <div className="mb-5 h-7 w-40 animate-pulse rounded bg-[#eee] lg:mb-7" />
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
              {Array.from({ length: PER_CATEGORY }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div
                    className="w-full rounded-md bg-[#eee]"
                    style={{ aspectRatio: "3 / 4" }}
                  />
                  <div className="mt-3 h-4 w-3/4 rounded bg-[#eee]" />
                  <div className="mt-2 h-4 w-1/4 rounded bg-[#eee]" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  if (rows.length === 0) return null;

  return (
    <div className="container-x py-6 lg:py-10">
      {rows.map((row) => (
        <section key={row.id} className="mb-12 lg:mb-16">
          <Reveal>
            <div className="mb-5 flex items-end justify-between gap-4 lg:mb-7">
              <h2 className="font-serif text-2xl font-bold capitalize leading-tight text-[var(--foreground)] lg:text-3xl">
                {row.name.toLowerCase()}
              </h2>
              <Link
                href={`/search?cat=${encodeURIComponent(row.name)}`}
                className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)] transition hover:text-[var(--accent-dark)]"
              >
                View all
                <ArrowRight />
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
              {row.products.map((p) => (
                <CarCard
                  key={p._id}
                  temp={p}
                  showNewBadge={false}
                  showBestSellerBadge={false}
                />
              ))}
            </div>
          </Reveal>
        </section>
      ))}
    </div>
  );
}
