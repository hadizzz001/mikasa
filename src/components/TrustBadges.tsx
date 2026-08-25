"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Truck, Undo2, ShieldCheck, Headphones } from "lucide-react";
import { optimizeImage } from "../lib/cloudinaryQuality";
import { getJson } from "../lib/apiFetch";

type Section = {
  _id: string;
  order: number;
  title: string;
  description: string | null;
  value: string | null;
  url: string | null;
  img?: string[] | null;
};

// Fallback icons, mapped by section order — only used when a Section doc has
// no `img` uploaded, so the design never renders an empty slot.
const iconByOrder: Record<number, React.ReactNode> = {
  1: <Truck size={34} strokeWidth={1.5} />,
  2: <Undo2 size={34} strokeWidth={1.5} />,
  3: <ShieldCheck size={34} strokeWidth={1.5} />,
  4: <Headphones size={34} strokeWidth={1.5} />,
};

// First non-empty URL of the `img` array (the CMS stores an array per section).
function getIconSrc(s: Section): string | null {
  if (!Array.isArray(s.img)) return null;
  const found = s.img.find((u) => typeof u === "string" && u.trim());
  return found ? optimizeImage(found) : null;
}

// Build the subtitle: use the description when present, otherwise fall back to
// "On orders over {value} USD" for sections that only carry a value.
function getSubtitle(s: Section): string {
  if (s.description && s.description.trim()) return s.description;
  if (s.value && String(s.value).trim()) return `On orders over ${s.value} USD`;
  return "";
}

export default function TrustBadges() {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    getJson<Section[]>("/api/section").then((d) => {
      if (Array.isArray(d) && d.length > 0) {
        setSections([...d].sort((a, b) => (a.order || 0) - (b.order || 0)));
      }
    });
  }, []);

  return (
    <section className="trust-badges mt-10 mb-10" aria-label="Why shop with us">
      <div className="container-x">
        <ul className="trust-badges__list">
          {sections.map((s, i) => {
            const iconSrc = getIconSrc(s);
            const inner = (
              <>
                <span className="trust-badges__icon">
                  {iconSrc ? (
                    <Image
                      src={iconSrc}
                      alt=""
                      width={34}
                      height={34}
                      className="trust-badges__icon-img"
                    />
                  ) : (
                    iconByOrder[s.order] ?? iconByOrder[(i % 4) + 1]
                  )}
                </span>
                <span className="trust-badges__title">{s.title}</span>
                <span className="trust-badges__subtitle">{getSubtitle(s)}</span>
              </>
            );
            return (
              <li key={s._id} className="trust-badges__item">
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="trust-badges__content trust-badges__content--link"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="trust-badges__content">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
