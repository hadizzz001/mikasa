"use client";

import { useEffect, useState } from "react";
import { getJson } from "../../lib/apiFetch";
import Reveal from "../../components/Reveal";
import { cleanRichHtml } from "../../lib/richText";

type PrivacyDoc = {
  _id: string;
  description: string;
};

export default function PrivacyContent() {
  const [doc, setDoc] = useState<PrivacyDoc | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    getJson<PrivacyDoc[]>("/api/privacy")
      .then((data) => {
        if (active && Array.isArray(data) && data.length) setDoc(data[0]);
      })
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
        <div className="mx-auto max-w-3xl animate-pulse space-y-4">
          <div className="mx-auto h-8 w-1/2 rounded bg-[var(--surface-2)]" />
          <div className="h-4 w-full rounded bg-[var(--surface-2)]" />
          <div className="h-4 w-11/12 rounded bg-[var(--surface-2)]" />
          <div className="h-4 w-10/12 rounded bg-[var(--surface-2)]" />
          <div className="h-4 w-9/12 rounded bg-[var(--surface-2)]" />
        </div>
      </div>
    );
  }

  if (!doc?.description) {
    return (
      <div className="container-x py-20">
        <p className="text-center text-[var(--muted-fg)]">
          Privacy policy is not available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="container-x py-12 lg:py-20">
      <Reveal>
        <article
          className="rich-content mx-auto max-w-3xl"
          dangerouslySetInnerHTML={{ __html: cleanRichHtml(doc.description) }}
        />
      </Reveal>
    </div>
  );
}
