"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import { getJson } from "../lib/apiFetch";

type CircleCat = {
  label: string;
  href: string;
  src: string;
};

type CategoryRow = {
  id: string;
  name: string;
  img: string[];
  sort?: number | null;
};

export default function CircleCategories() {
  const [items, setItems] = useState<CircleCat[]>([]);
  const [perView, setPerView] = useState(5);
  const count = items.length;
  // `pos` is the logical position within a triple-buffered track. The middle
  // copy starts at index `count`, which lets us scroll endlessly in either
  // direction and silently recenter when we drift into an outer copy.
  const [pos, setPos] = useState(0);
  const [animate, setAnimate] = useState(true);

  // Drag/swipe state.
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragPx, setDragPx] = useState(0);
  const startXRef = useRef(0);
  const movedRef = useRef(false);

  // Load categories (image + title) from the API.
  useEffect(() => {
    let active = true;
    getJson<CategoryRow[]>("/api/category").then((data) => {
      if (!active || !Array.isArray(data)) return;
        setItems(
          [...data]
            .sort(
              (a, b) =>
                (a.sort ?? Number.MAX_SAFE_INTEGER) -
                (b.sort ?? Number.MAX_SAFE_INTEGER)
            )
            .filter((c) => c.img?.[0])
            .map((c) => ({
              label: c.name,
              href: `/search?cat=${encodeURIComponent(c.name)}`,
              src: c.img[0],
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

  // Show 6 per row on PC (lg and up), 5 on smaller screens.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setPerView(mq.matches ? 6 : 5);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Triple the list so the track can scroll seamlessly in both directions.
  const loop = count > 0 ? [...items, ...items, ...items] : [];

  // Auto-advance one item at a time (paused while dragging).
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (count === 0 || dragging) return;
    timer.current = setInterval(() => {
      setPos((p) => p + 1);
    }, 3000);
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
      }, 650);
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

  const itemBasis = 100 / perView;
  const offset = pos * itemBasis;

  if (count === 0) return null;

  return (
    <section className="sana-circle-cats" aria-label="Shop by category">
      <div className="container-x">
        <Reveal>
          <div className="cat-slider">
            <div className="cat-slider__viewport" ref={viewportRef}>
              <ul
                // `is-instant` (drag + silent recenter) must beat the slide
                // transition in CSS, so it is a class rather than an inline style.
                className={`cat-slider__track${
                  dragging || !animate ? " is-instant" : ""
                }`}
                onPointerDown={onPointerDown}
                onClickCapture={onClickCapture}
                style={{
                  transform: dragging
                    ? `translateX(calc(-${offset}% + ${dragPx}px))`
                    : `translateX(-${offset}%)`,
                  cursor: dragging ? "grabbing" : "grab",
                  touchAction: "pan-y",
                }}
              >
                {loop.map((c, i) => (
                  <li
                    key={`${c.label}-${i}`}
                    className="cat-slider__item"
                    style={{ flexBasis: `${itemBasis}%` }}
                  >
                    <Link
                      href={c.href}
                      className="sana-circle-cats__link"
                      draggable={false}
                    >
                      <span className="sana-circle-cats__thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.src}
                          alt={c.label}
                          loading="lazy"
                          draggable={false}
                          className="sana-circle-cats__img"
                        />
                      </span>
                      <span className="sana-circle-cats__label">{c.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}




