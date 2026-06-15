"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Reveal from "../../components/Reveal";
import { cleanRichHtml } from "../../lib/richText";

type AboutDoc = {
  _id: string;
  description: string;
  img?: string[];
};

export default function AboutContent() {
  const [doc, setDoc] = useState<AboutDoc | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/about")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: AboutDoc[]) => {
        if (active && Array.isArray(data) && data.length) setDoc(data[0]);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!loaded) {
    return (
      <div className="container-x py-12 lg:py-20">
        <div className="mx-auto max-w-4xl animate-pulse space-y-8">
          <div className="aspect-[4/5] w-full rounded-[10px] bg-[var(--surface-2)] sm:aspect-[16/9]" />
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="h-7 w-1/3 rounded bg-[var(--surface-2)]" />
            <div className="h-4 w-full rounded bg-[var(--surface-2)]" />
            <div className="h-4 w-11/12 rounded bg-[var(--surface-2)]" />
            <div className="h-4 w-10/12 rounded bg-[var(--surface-2)]" />
          </div>
        </div>
      </div>
    );
  }

  if (!doc?.description) {
    return (
      <div className="container-x py-20">
        <p className="text-center text-[var(--muted-fg)]">
          About content is not available right now.
        </p>
      </div>
    );
  }

  const image = doc.img?.find((src) => src && src.trim());

  return (
    <div className="container-x py-12 lg:py-20">
      <div className="mx-auto max-w-4xl">
        {image && (
          <Reveal>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-[var(--surface-2)] sm:aspect-[16/9]">
              <Image
                src={image}
                alt="Mikasa Home"
                fill
                sizes="(min-width: 1024px) 56rem, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        )}

        <Reveal delay={image ? 120 : 0}>
          <article
            className={`rich-content mx-auto max-w-3xl ${
              image ? "mt-10 lg:mt-14" : ""
            }`}
            dangerouslySetInnerHTML={{ __html: cleanRichHtml(doc.description) }}
          />
        </Reveal>
      </div>
    </div>
  );
}
