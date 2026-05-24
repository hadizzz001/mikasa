import Image from "next/image";
import Reveal from "./Reveal";

type Banner = {
  src: string;
  alt: string;
  href: string;
};

const banners: {
  left: Banner;
  topRight: Banner;
  bottomLeft: Banner;
  bottomRight: Banner;
} = {
  left: {
    src: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Banner-1-2.png.webp",
    alt: "What's new collection",
    href: "#whats-new",
  },
  topRight: {
    src: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Banner-2-2.png.webp",
    alt: "Back in stock favorites",
    href: "#back-in-stock",
  },
  bottomLeft: {
    src: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Banner-3-2.png.webp",
    alt: "Storage & organization",
    href: "#storage",
  },
  bottomRight: {
    src: "https://www.rayanesbhomes.com/wp-content/uploads/2026/05/Banner-4-2.png.webp",
    alt: "Clearance sale",
    href: "#sale",
  },
};

function BannerCard({
  banner,
  className = "",
  priority = false,
  sizes,
}: {
  banner: Banner;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <a
      href={banner.href}
      aria-label={banner.alt}
      className={`group relative block overflow-hidden rounded-lg bg-[var(--surface)] ${className}`}
    >
      <Image
        src={banner.src}
        alt={banner.alt}
        fill
        priority={priority}
        sizes={sizes ?? "(min-width: 1024px) 50vw, 100vw"}
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
      />
    </a>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="relative w-full bg-white">
      <div className="container-x py-6 md:py-10">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            {/* Left: large square banner */}
            <BannerCard
              banner={banners.left}
              className="aspect-square w-full"
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
            />

            {/* Right column: rectangle on top + two squares under it */}
            <div className="grid lg:grid-rows-[1fr_1fr] gap-4 md:gap-5">
              {/* Top rectangle */}
              <BannerCard
                banner={banners.topRight}
                className="w-full aspect-[5/2] lg:aspect-auto lg:h-full"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />

              {/* Two squares */}
              <div className="grid grid-cols-2 gap-4 md:gap-5">
                <BannerCard
                  banner={banners.bottomLeft}
                  className="w-full aspect-square"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
                <BannerCard
                  banner={banners.bottomRight}
                  className="w-full aspect-square"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
