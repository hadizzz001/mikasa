import Image from "next/image";
import Reveal from "./Reveal";

type Card = {
  label: string;
  sub?: string;
  href: string;
  src: string;
};

const big: Card = {
  label: "Jewelry / Makeup",
  sub: "Storage & Luggage",
  href: "#",
  src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1779554412/makeup_ebbdng.jpg",
};

const cards: Card[] = [
  {
    label: "Closet",
    href: "#",
    src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1779554412/closet_pk4rkf.jpg",
  },
  {
    label: "Baskets & Bins",
    href: "#",
    src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1779554412/bin_aokba9.jpg",
  },
  {
    label: "Entryway",
    href: "#",
    src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1779554412/entry_nsrzvv.jpg",
  },
  {
    label: "Storage Furniture",
    href: "#",
    src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1779554412/furnt_uumhy1.jpg",
  },
  {
    label: "Wall Shelving",
    href: "#",
    src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1779554413/wall_a8ykaa.jpg",
  },
  {
    label: "Office & Desk",
    href: "#",
    src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1779554413/office_fj2mzl.jpg",
  },
];

function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CardItem({
  card,
  className = "",
  sizes,
}: {
  card: Card;
  className?: string;
  sizes: string;
}) {
  return (
    <a
      href={card.href}
      className={`group relative block overflow-hidden rounded-[var(--radius)] ${className}`}
    >
      <Image
        src={card.src}
        alt={card.label}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Black gradient at the bottom for legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />
      {/* Label + arrow */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
        <p className="inline-flex items-end gap-2 text-sm sm:text-base font-medium leading-tight whitespace-pre-line">
          <span>{card.sub ? `${card.label}\n${card.sub}` : card.label}</span>
          <ArrowRight />
        </p>
      </div>
    </a>
  );
}

export default function CatGrid() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container-x">
        <Reveal>
          {/* Mobile: 2-col grid, big card spans both cols (row 1), then 3 rows of 2 rects.
              Desktop (md+): 4 columns 30%/20%/20%/20% with ~3.33% gaps, big card spans 2 rows. */}
          <div className="catgrid">
            {/* Big square card */}
            <div className="catgrid-big">
              <CardItem
                card={big}
                className="h-full w-full"
                sizes="(min-width: 768px) 30vw, 100vw"
              />
            </div>

            {/* Six rectangle cards */}
            {cards.map((c) => (
              <div key={c.label} className="catgrid-cell">
                <CardItem
                  card={c}
                  className="h-full w-full"
                  sizes="(min-width: 768px) 20vw, 50vw"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
