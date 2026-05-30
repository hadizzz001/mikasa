"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { circleCategories } from "../data/categories";

export default function CircleCategories() {
  const perView = 5;
  const count = circleCategories.length;
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  // Duplicate the list so the track can scroll seamlessly without snapping back.
  const loop = [...circleCategories, ...circleCategories];

  // Auto-advance one item at a time, forever in the same direction.
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    timer.current = setInterval(() => {
      setIndex((i) => i + 1);
    }, 3000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  // When we've scrolled a full set, jump back to the start with no transition,
  // creating an endless one-direction loop.
  useEffect(() => {
    if (index === count) {
      const t = setTimeout(() => {
        setAnimate(false);
        setIndex(0);
      }, 650);
      return () => clearTimeout(t);
    }
    if (index === 0 && !animate) {
      // Re-enable the transition on the next frame after the silent reset.
      const r = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(r);
    }
  }, [index, count, animate]);

  const itemBasis = 100 / perView;
  const offset = index * itemBasis;

  return (
    <section className="sana-circle-cats" aria-label="Shop by category">
      <div className="container-x">
        <Reveal>
          <div className="cat-slider">
            <div className="cat-slider__viewport">
              <ul
                className="cat-slider__track"
                style={{
                  transform: `translateX(-${offset}%)`,
                  transition: animate ? undefined : "none",
                }}
              >
                {loop.map((c, i) => (
                  <li
                    key={`${c.label}-${i}`}
                    className="cat-slider__item"
                    style={{ flexBasis: `${itemBasis}%` }}
                    aria-hidden={i >= count}
                  >
                    <a href={c.href} className="sana-circle-cats__link">
                      <span className="sana-circle-cats__thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.src}
                          alt={c.label}
                          loading="lazy"
                          className="sana-circle-cats__img"
                        />
                      </span>
                      <span className="sana-circle-cats__label">{c.label}</span>
                    </a>
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




