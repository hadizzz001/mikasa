"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import { getJson } from "../lib/apiFetch";

type BannerRow = {
  id: string;
  img: string[];
  imgMobile: string[];
  imgPc: string[];
};

export default function Hero2() {
  const [banner, setBanner] = useState<BannerRow | null>(null);

  useEffect(() => {
    let active = true;
    getJson<BannerRow[]>("/api/quotebanner").then((data) => {
      if (active && Array.isArray(data) && data.length) setBanner(data[0]);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!banner) return null;

  const mobileSrc =
    banner.imgMobile?.[0] || banner.img?.[0] || banner.imgPc?.[0];
  const pcSrc = banner.imgPc?.[0] || banner.img?.[0] || banner.imgMobile?.[0];

  if (!mobileSrc && !pcSrc) return null;

  const alt = "Featured banner";

  return (
    <section id="hero" className="relative w-full bg-white">
      <div className="container-x  ">
        <Reveal>
          <a
            href="#"
            aria-label={alt}
            className="group block overflow-hidden rounded-[10px]"
          >
            {/* Mobile banner */}
            <Image
              src={mobileSrc || pcSrc}
              alt={alt}
              width={1920}
              height={800}
              priority
              sizes="100vw"
              className="lg:hidden w-full h-auto object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
            />
            {/* Desktop banner */}
            <Image
              src={pcSrc || mobileSrc}
              alt={alt}
              width={1920}
              height={800}
              priority
              sizes="100vw"
              className="hidden lg:block w-full h-auto object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

