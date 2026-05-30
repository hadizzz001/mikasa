"use client";

import { useEffect, useRef, useState } from "react";

type Promo = {
  src: string;
  alt: string;
  href: string;
};

const promos: Promo[] = [
  {
    src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1780081939/9831fc12-f1dd-440f-9ddd-550c075a7678_zxqfng.jpg",
    alt: "Featured collection 1",
    href: "#",
  },
  {
    src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1780081939/pxbee_eraser_2026-05-29_18-20-17_euunni.jpg",
    alt: "Featured collection 2",
    href: "#",
  },
  {
    src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1780081940/971fd2dc-f1cd-4252-844e-7886cbd77739_zimbsc.jpg",
    alt: "Featured collection 3",
    href: "#",
  },
];

export default function PromoSlider() {
  const perView = 2;
  const count = promos.length;
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  // Duplicate the list so the track can scroll seamlessly without snapping back.
  const loop = [...promos, ...promos];

  // Auto-advance one item at a time, forever in the same direction.
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    timer.current = setInterval(() => {
      setIndex((i) => i + 1);
    }, 3500);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  // When a full set has scrolled past, jump back to the start with no
  // transition so the one-direction loop looks endless.
  useEffect(() => {
    if (index === count) {
      const t = setTimeout(() => {
        setAnimate(false);
        setIndex(0);
      }, 700);
      return () => clearTimeout(t);
    }
    if (index === 0 && !animate) {
      const r = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(r);
    }
  }, [index, count, animate]);

  // Each step shifts the track by one item. The transform percentage is
  // relative to the (wide) track, so one item = 100 / loop.length percent.
  const offset = index * (100 / loop.length);

  return (
    <section className="promo-slider" aria-label="Featured collections">
      <div className="container-x">
        <div className="promo-slider__viewport">
          <div
            className="promo-slider__track"
            style={{
              width: `${(loop.length * 100) / perView}%`,
              transform: `translateX(-${offset}%)`,
              transition: animate ? undefined : "none",
            }}
          >
            {loop.map((p, i) => (
              <a
                key={`${p.alt}-${i}`}
                href={p.href}
                aria-label={p.alt}
                aria-hidden={i >= count}
                className="promo-slider__item"
                style={{ width: `${100 / loop.length}%` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="promo-slider__img"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
