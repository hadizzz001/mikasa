import Image from "next/image";
import Reveal from "./Reveal";

const banner = {
  src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1780083005/dd79e1a0-463e-405f-8135-d081fd96cf28_ytu0dr.jpg",
  alt: "What's new collection",
  href: "#whats-new",
};

export default function Hero() {
  return (
    <section id="hero" className="relative w-full bg-white">
      <div className="container-x ">
        <Reveal>
          <a
            href={banner.href}
            aria-label={banner.alt}
            className="group block overflow-hidden rounded-[10px]"
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              width={1920}
              height={800}
              priority
              sizes="100vw"
              className="w-full h-auto object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

