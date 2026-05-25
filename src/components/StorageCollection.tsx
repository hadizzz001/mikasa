"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

type Product = {
  name: string;
  img: string;
  price: number;
  oldPrice?: number;
  badge?: string;
};

const products: Product[] = [
  {
    name: "Woven Rattan Storage Basket — Large",
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Ceramic-Stoneware-Salad-and-Dessert-Plate-Non-Scratch-and-Sturdy-Medium-Round-Appetizer-and-Cake-Serving-Plate-White-Speckled-14-600x600.jpg.webp",
    price: 34.0,
    badge: "New",
  },
  {
    name: "3-Tier Wall Shelf — Solid Oak",
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Reactive-Glaze-Stoneware-Dinner-Plate-Non-Scratch-Sturdy-Round-Main-Course-Serving-Plate-for-Everyday-Dining-Beige-2-600x600.jpg.webp",
    price: 119.0,
    oldPrice: 149.0,
    badge: "Sale",
  },
  {
    name: "Entryway Coat Rack with Bench",
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Ceramic-Stoneware-Dinner-Plate-Non-Scratch-Sturdy-Round-Main-Course-Serving-Plate-for-Everyday-Dining-White-Speckled-2-600x600.jpg.webp",
    price: 189.0,
  },
  {
    name: "Velvet Jewelry Organizer Box",
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Reactive-Glaze-Stoneware-Salad-and-Dessert-Plate-Non-Scratch-and-Sturdy-Medium-Round-Appetizer-and-Cake-Serving-Plate-Beige-3-600x600.jpg.webp",
    price: 42.0,
  },
  {
    name: "Closet Drawer Dividers — Set of 4",
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Ceramic-Stoneware-Salad-and-Dessert-Plate-Non-Scratch-and-Sturdy-Medium-Round-Appetizer-and-Cake-Serving-Plate-White-Speckled-3-600x600.jpg.webp",
    price: 22.5,
    badge: "New",
  },
  {
    name: "Stackable Storage Bins — Beige",
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Ceramic-Stoneware-Dinner-Plate-Non-Scratch-Sturdy-Round-Main-Course-Serving-Plate-for-Everyday-Dining-White-Speckled-1-600x600.jpg.webp",
    price: 16.0,
  },
  {
    name: "Desk Organizer Caddy — Walnut",
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Ceramic-Stoneware-Salad-and-Dessert-Plate-Non-Scratch-and-Sturdy-Medium-Round-Appetizer-and-Cake-Serving-Plate-White-Speckled-2-600x600.jpg.webp",
    price: 38.0,
  },
  {
    name: "Hanging Wall Hooks — Brass Finish",
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Reactive-Glaze-Stoneware-Dinner-Plate-Non-Scratch-Sturdy-Round-Main-Course-Serving-Plate-for-Everyday-Dining-Beige-1-600x600.jpg.webp",
    price: 14.0,
    badge: "Sale",
    oldPrice: 18.0,
  },
];

export default function StorageCollection() {
  const scroller = useRef<HTMLDivElement | null>(null);
  const isPaused = useRef(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = () => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const el = scroller.current;
      if (!el || isPaused.current) return;

      const card = el.querySelector<HTMLElement>("[data-card]");
      const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.85;
      const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - step;

      el.scrollTo({
        left: nearEnd ? 0 : el.scrollLeft + step,
        behavior: "smooth",
      });
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="storage" className="py-16 lg:py-24 bg-white">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left: product slider */}
          <div className="lg:col-span-8 relative order-2 lg:order-1">
            <div
              ref={scroller}
              onMouseEnter={() => {
                isPaused.current = true;
              }}
              onMouseLeave={() => {
                isPaused.current = false;
              }}
              className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 no-scrollbar"
            >
              {products.map((p) => (
                <article
                  key={p.name}
                  data-card
                  className="snap-start shrink-0 w-[70%] sm:w-[48%] md:w-[32%] xl:w-[24%] group"
                >
                  <a href="#" className="block">
                    <div className="relative aspect-square overflow-hidden rounded-[var(--radius)] bg-[var(--surface)]">
                      <Image
                        src={p.img}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 70vw, 24vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {p.badge && (
                        <span
                          className={`absolute top-3 left-3 text-[0.65rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${
                            p.badge === "Sale"
                              ? "bg-[var(--dark)] text-white"
                              : "bg-white text-[var(--dark)]"
                          }`}
                        >
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div className="pt-3">
                      <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent-dark)] transition-colors">
                        {p.name}
                      </h3>
                      <div className="mt-1 flex items-baseline gap-2">
                        {p.oldPrice && (
                          <span className="text-xs text-[var(--muted-fg)] line-through">
                            ${p.oldPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-sm font-bold text-[var(--dark)]">
                          ${p.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </a>
                </article>
              ))}
            </div>

            {/* Arrows */}
            <button
              type="button"
              aria-label="Previous products"
              onClick={() => scrollByCards(-1)}
              disabled={!canPrev}
              className="absolute top-1/2 -left-3 md:-left-5 -translate-y-[60%] z-10 w-11 h-11 rounded-full bg-white shadow-lg border border-[var(--border)] flex items-center justify-center text-[var(--dark)] hover:bg-[var(--dark)] hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next products"
              onClick={() => scrollByCards(1)}
              disabled={!canNext}
              className="absolute top-1/2 -right-3 md:-right-5 -translate-y-[60%] z-10 w-11 h-11 rounded-full bg-white shadow-lg border border-[var(--border)] flex items-center justify-center text-[var(--dark)] hover:bg-[var(--dark)] hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Right: creative blob promo card */}
          <Reveal className="lg:col-span-4 order-1 lg:order-2">
            <div className="sana-decor-blob">
              <h5 className="kicker mb-3 sana-decor-blob__kicker">DISCOVER OUR</h5>
              <h2 className="section-title mb-4 sana-decor-blob__title">Organization Collection</h2>
              <p className="leading-relaxed mb-7 sana-decor-blob__text">
                Discover chic ways to organize and simplify your life!
              </p>
              <a href="#" className="sana-decor-blob__cta">
                SHOP ALL COLLECTION
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
