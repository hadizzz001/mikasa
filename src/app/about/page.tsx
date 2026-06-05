import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "../../components/Reveal";

export const metadata: Metadata = {
  title: "About Us — Sana Home",
  description:
    "Our story: established in 2026, Sana Home curates timeless home accessories that bring warmth, balance and modern elegance into everyday living.",
};

// Hosted on Cloudinary, which is already whitelisted in next.config.ts.
const ABOUT_IMAGE =
  "https://res.cloudinary.com/dh2c4clxo/image/upload/v1780666368/8305_51796_pglaz2.jpg";

export default function AboutPage() {
  return (
    <div className="container-x py-12 lg:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Our Story — text on the left, image on the right */}
        <section className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="flex h-full flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-fg)]">
                Sana Home
              </p>
              <h1 className="mt-3 font-serif text-3xl font-bold uppercase tracking-wide lg:text-4xl">
                Our Story
              </h1>
              <p className="mt-5 font-serif text-lg italic text-[var(--foreground)] lg:text-xl">
                &ldquo;A Home is The Starting Place of Love, Hope and Dreams.&rdquo;
              </p>
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[var(--muted-fg)]">
                <p>
                  Welcome to Sana Home. Established in 2026, our journey began with a
                  simple belief: the objects we surround ourselves with should bring
                  warmth, balance, and modern elegance into everyday living.
                </p>
                <p>
                  Sana Home was born from a deep passion for interior design and a
                  desire to curate timeless accessories that transform a house into a
                  true sanctuary. Inspired by the warmth and care that define a family
                  home, our brand is built on the foundations of thoughtful curation,
                  quality craftsmanship, and modern aesthetics.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-[var(--surface-2)] lg:aspect-auto lg:h-full lg:min-h-[540px]">
              <Image
                src={ABOUT_IMAGE}
                alt="Sana Home curated interior styling"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        </section>

        {/* Our Philosophy + The Sana Home Promise */}
        <div className="mx-auto mt-14 max-w-3xl space-y-12 lg:mt-20">
          <Reveal>
            <section>
              <h2 className="font-serif text-2xl font-bold uppercase tracking-wide lg:text-3xl">
                Our Philosophy
              </h2>
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-[var(--muted-fg)]">
                <p>
                  At Sana Home, we don&rsquo;t simply sell home accessories — we
                  carefully handpick pieces that tell a story. From contemporary
                  minimalist vases and striking statement mirrors to elegant
                  kitchenware, every item in our collection is selected with an eye for
                  detail, form, and functionality.
                </p>
                <p>
                  We believe modern design should never feel cold. Instead, it should
                  feel inviting, balanced, and beautifully integrated into everyday
                  life.
                </p>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-serif text-2xl font-bold uppercase tracking-wide lg:text-3xl">
                The Sana Home Promise
              </h2>
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-[var(--muted-fg)]">
                <p>
                  Whether you are completely refreshing your living room or searching
                  for the perfect accent piece to complete a space, we are dedicated to
                  helping you create a home you truly love coming back to.
                </p>
                <p>
                  We bridge the gap between contemporary trends and timeless quality,
                  ensuring that every piece you discover at Sana Home is something you
                  will cherish for years to come.
                </p>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <p className="border-t border-[var(--border)] pt-8 text-center font-serif text-lg italic text-[var(--foreground)]">
              Thank you for allowing us to be a small part of your home&rsquo;s story.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
