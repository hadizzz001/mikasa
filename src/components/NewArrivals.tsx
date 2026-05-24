"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

type Product = {
  name: string;
  price: number;
  img: string;
};

// Sourced from rayanesbhomes.com (mirror reference) — New Arrivals carousel
const products: Product[] = [
  {
    name: "21 CM Ceramic Stoneware Side Plate Non Scratch and Sturdy Medium Round Appetizer and Cake Serving Plate Light Gray Speckled",
    price: 2.43,
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Ceramic-Stoneware-Salad-and-Dessert-Plate-Non-Scratch-and-Sturdy-Medium-Round-Appetizer-and-Cake-Serving-Plate-White-Speckled-14-600x600.jpg.webp",
  },
  {
    name: "27 CM Reactive Glaze Stoneware Dinner Plate Non Scratch Sturdy Round Main Course Serving Plate for Everyday Dining Gray",
    price: 3.30,
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Reactive-Glaze-Stoneware-Dinner-Plate-Non-Scratch-Sturdy-Round-Main-Course-Serving-Plate-for-Everyday-Dining-Beige-2-600x600.jpg.webp",
  },
  {
    name: "28 CM Ceramic Stoneware Dinner Plate Non Scratch Sturdy Round Main Course Serving Plate for Everyday Dining Beige Speckled",
    price: 3.45,
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Ceramic-Stoneware-Dinner-Plate-Non-Scratch-Sturdy-Round-Main-Course-Serving-Plate-for-Everyday-Dining-White-Speckled-2-600x600.jpg.webp",
  },
  {
    name: "20 CM Minimalist Stoneware Dinner Plate Round Main Course Plate Everyday Dining Gray",
    price: 2.37,
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Reactive-Glaze-Stoneware-Salad-and-Dessert-Plate-Non-Scratch-and-Sturdy-Medium-Round-Appetizer-and-Cake-Serving-Plate-Beige-3-600x600.jpg.webp",
  },
  {
    name: "21 CM Reactive Glaze Stoneware Side Plate Medium Round Appetizer and Cake Plate Gray",
    price: 2.37,
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Ceramic-Stoneware-Salad-and-Dessert-Plate-Non-Scratch-and-Sturdy-Medium-Round-Appetizer-and-Cake-Serving-Plate-White-Speckled-3-600x600.jpg.webp",
  },
  {
    name: "19 CM Reactive Glaze Stoneware Serving Bowl Deep Multipurpose Bowl for Salad Fruit and Sides Gray",
    price: 2.52,
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Ceramic-Stoneware-Dinner-Plate-Non-Scratch-Sturdy-Round-Main-Course-Serving-Plate-for-Everyday-Dining-White-Speckled-1-600x600.jpg.webp",
  },
  {
    name: "15 CM Ceramic Stoneware Serving Bowl Deep Multipurpose Bowl Gray Speckled",
    price: 2.94,
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Ceramic-Stoneware-Salad-and-Dessert-Plate-Non-Scratch-and-Sturdy-Medium-Round-Appetizer-and-Cake-Serving-Plate-White-Speckled-2-600x600.jpg.webp",
  },
  {
    name: "Reactive Glaze Stoneware Coffee Mug Textured Tea and Coffee Cup with Comfortable Handle Beige",
    price: 2.16,
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Reactive-Glaze-Stoneware-Dinner-Plate-Non-Scratch-Sturdy-Round-Main-Course-Serving-Plate-for-Everyday-Dining-Beige-1-600x600.jpg.webp",
  },
  {
    name: "28 CM Reactive Glaze Stoneware Dinner Plate Round Main Course Plate Everyday Dining Blue",
    price: 3.45,
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Reactive-Glaze-Stoneware-Dinner-Plate-Non-Scratch-Sturdy-Round-Main-Course-Serving-Plate-for-Everyday-Dining-Beige-4-600x600.jpg.webp",
  },
  {
    name: "22 CM Reactive Glaze Stoneware Salad and Dessert Plate Medium Round Appetizer and Cake Plate Blue",
    price: 2.43,
    img: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Ceramic-Stoneware-Dinner-Plate-Non-Scratch-Sturdy-Round-Main-Course-Serving-Plate-for-Everyday-Dining-White-Speckled-4-600x600.jpg.webp",
  },
];

export default function NewArrivals() {
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
    }, 3000);

    return () => window.clearInterval(timer);
  }, []);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="new-arrivals" className="py-16 lg:py-24 bg-white">
      <div className="container-x">
        {/* whatsnewtext block — centered header */}
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-12">
            <h2 className="section-title mb-3">New Arrivals!</h2>
            <p className="text-[var(--muted-fg)] leading-relaxed mb-6">
              Check out the latest must-haves for your home.
            </p>
            <a href="#" className="btn-primary">
              SEE WHATS NEW
            </a>
          </div>
        </Reveal>

        {/* whatsnew carousel */}
        <div className="relative">
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
            {products.map((p, i) => (
              <article
                key={i}
                data-card
                className="snap-start shrink-0 w-[72%] sm:w-[44%] md:w-[28%] lg:w-[22%] xl:w-[16.5%] product-card"
              >
                <div className="pimg">
                  <span className="badge">New</span>
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 70vw, (max-width: 1280px) 22vw, 16vw"
                    className="object-cover"
                  />
                  <div className="actions">
                    <button aria-label="Add to cart" type="button">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M3 4h2l2.5 12.5A2 2 0 0 0 9.46 18H18a2 2 0 0 0 2-1.6L21.5 8H6" />
                        <circle cx="9" cy="21" r="1.4" />
                        <circle cx="18" cy="21" r="1.4" />
                      </svg>
                    </button>
                    <button aria-label="Quick view" type="button">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button aria-label="Add to wishlist" type="button">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6.5a5.5 5.5 0 0 1 9.5 5.5C19 16.5 12 21 12 21Z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="pinfo">
                  <a
                    href="#"
                    className="pname line-clamp-2 hover:text-[var(--accent-dark)] transition-colors"
                  >
                    {p.name}
                  </a>
                  <div>
                    <span className="price text-[0.95rem]">
                      {p.price.toFixed(2)}&nbsp;
                      <span className="text-[var(--muted-fg)] font-normal">$</span>
                    </span>
                  </div>
                  <span className="stock inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5b9d65]" />
                    In stock
                  </span>
                </div>
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
      </div>
    </section>
  );
}
