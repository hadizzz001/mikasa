"use client";

import { useEffect, useState } from "react";
import { Truck, Undo2, ShieldCheck, Headphones } from "lucide-react";

type Section = {
  _id: string;
  order: number;
  title: string;
  description: string | null;
  value: string | null;
  url: string | null;
};

// Icons are mapped by the section order so the design stays consistent even
// though the text/links are driven by the Section collection in MongoDB.
const iconByOrder: Record<number, React.ReactNode> = {
  1: <Truck size={34} strokeWidth={1.5} />,
  2: <Undo2 size={34} strokeWidth={1.5} />,
  3: <ShieldCheck size={34} strokeWidth={1.5} />,
  4: <Headphones size={34} strokeWidth={1.5} />,
};

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
    fetch("/api/section")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d) && d.length > 0) {
          setSections([...d].sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
      })
      .catch(() => {
        setSections([]);
      });
  }, []);

  return (
    <section className="trust-badges mt-10 mb-10" aria-label="Why shop with us">
      <div className="container-x">
        <ul className="trust-badges__list">
          {sections.map((s, i) => {
            const inner = (
              <>
                <span className="trust-badges__icon">
                  {iconByOrder[s.order] ?? iconByOrder[(i % 4) + 1]}
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
