"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getJson } from "../lib/apiFetch";

type Promo = {
  src: string;
  alt: string;
  href: string;
};

type OtherBannerRow = {
  id: string;
  key: string;
  img: string[];
  percentage?: string | null;
};

// Map an OtherBanner row to the search URL it opens when clicked. The API
// exposes three keys: "bestSeller", "newArrival" and "offer" (the latter
// carries a `percentage` value used here as a max price, e.g. "10" -> items
// priced under $10).
function bannerHref(key: string, percentage?: string | null): string {
  switch ((key || "").trim().toLowerCase()) {
    case "bestseller":
      return "/search?filter=best";
    case "newarrival":
      return "/search?filter=new";
    case "offer": {
      // Show products priced below the offer's threshold value.
      const maxPrice = Number(percentage);
      return maxPrice > 0 ? `/search?minoff=${maxPrice}` : "/search?filter=sale";
    }
    default:
      return "/search";
  }
}

// Friendly label used as the link's accessible name.
function bannerLabel(key: string): string {
  switch ((key || "").trim().toLowerCase()) {
    case "bestseller":
      return "Shop best sellers";
    case "newarrival":
      return "Shop new arrivals";
    case "offer":
      return "Shop offers";
    default:
      return key || "Featured collection";
  }
}

export default function PromoSlider() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [perView, setPerView] = useState(2);
  const count = promos.length;
  // `pos` is the logical position within a triple-buffered track (middle copy
  // starts at index `count`), enabling endless scrolling in both directions.
  const [pos, setPos] = useState(0);
  const [animate, setAnimate] = useState(true);

  // Drag/swipe state.
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragPx, setDragPx] = useState(0);
  const startXRef = useRef(0);
  const movedRef = useRef(false);

  // Load the OtherBanner rows from the API.
  useEffect(() => {
    let active = true;
    getJson<OtherBannerRow[]>("/api/otherbanner").then((data) => {
      if (!active || !Array.isArray(data)) return;
      setPromos(
        data
          .filter((b) => b.img?.[0])
          .map((b) => ({
            src: b.img[0],
            alt: bannerLabel(b.key),
            href: bannerHref(b.key, b.percentage),
          }))
      );
    });
    return () => {
      active = false;
    };
  }, []);

  // Start in the middle copy once the items are known.
  useEffect(() => {
    if (count > 0) setPos(count);
  }, [count]);

  // Show 3 per row on PC (lg and up), 2 on smaller screens.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setPerView(mq.matches ? 3 : 2);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Triple the list so the track can scroll seamlessly in both directions.
  const loop = count > 0 ? [...promos, ...promos, ...promos] : [];

  // Auto-advance one item at a time (paused while dragging).
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (count === 0 || dragging) return;
    timer.current = setInterval(() => {
      setPos((p) => p + 1);
    }, 3500);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [count, dragging]);

  // After a move settles, if we've drifted into an outer copy, silently jump
  // back into the middle copy so the loop feels endless.
  useEffect(() => {
    if (count === 0 || dragging) return;
    if (pos >= 2 * count || pos < count) {
      const t = setTimeout(() => {
        setAnimate(false);
        setPos((p) => {
          let np = p;
          while (np >= 2 * count) np -= count;
          while (np < count) np += count;
          return np;
        });
      }, 700);
      return () => clearTimeout(t);
    }
  }, [pos, count, dragging]);

  // Re-enable the transition on the frame after a silent recenter.
  useEffect(() => {
    if (!animate) {
      const r = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(r);
    }
  }, [animate]);

  // ----- Pointer drag handling -----
  const onPointerDown = (e: React.PointerEvent) => {
    if (count === 0) return;
    setDragging(true);
    setDragPx(0);
    movedRef.current = false;
    startXRef.current = e.clientX;
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - startXRef.current;
      if (Math.abs(dx) > 5) movedRef.current = true;
      setDragPx(dx);
    };
    const onUp = (e: PointerEvent) => {
      const dx = e.clientX - startXRef.current;
      const vp = viewportRef.current;
      const itemWidth = vp ? vp.clientWidth / perView : 1;
      const steps = Math.round(-dx / itemWidth);
      setDragPx(0);
      setDragging(false);
      if (steps !== 0) setPos((p) => p + steps);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, perView]);

  // Prevent a drag from triggering link navigation.
  const onClickCapture = (e: React.MouseEvent) => {
    if (movedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Each step shifts the track by one item. The transform percentage is
  // relative to the (wide) track, so one item = 100 / loop.length percent.
  const offset = loop.length ? pos * (100 / loop.length) : 0;

  if (count === 0) return null;

  return (
    <section className="promo-slider" aria-label="Featured collections">
      <div className="container-x">
        <div className="promo-slider__viewport" ref={viewportRef}>
          <div
            // `is-instant` (drag + silent recenter) must beat the slide
            // transition in CSS, so it is a class rather than an inline style.
            className={`promo-slider__track${
              dragging || !animate ? " is-instant" : ""
            }`}
            onPointerDown={onPointerDown}
            onClickCapture={onClickCapture}
            style={{
              width: `${(loop.length * 100) / perView}%`,
              transform: dragging
                ? `translateX(calc(-${offset}% + ${dragPx}px))`
                : `translateX(-${offset}%)`,
              cursor: dragging ? "grabbing" : "grab",
              touchAction: "pan-y",
            }}
          >
            {loop.map((p, i) => (
              <Link
                key={`${p.alt}-${i}`}
                href={p.href}
                aria-label={p.alt}
                draggable={false}
                className="promo-slider__item"
                style={{ width: `${100 / loop.length}%` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  draggable={false}
                  className="promo-slider__img"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
