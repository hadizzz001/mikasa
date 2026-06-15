import Image from "next/image";
import Reveal from "./Reveal";
import { bannerImage } from "../lib/cloudinaryQuality";

type Props = {
  id?: string;
  kicker: string;
  title: React.ReactNode;
  subtitle?: string;
  cta: string;
  ctaHref?: string;
  img: string;
  alt: string;
  align?: "left" | "right" | "center";
  dark?: boolean;
};

export default function CollectionBanner({
  id,
  kicker,
  title,
  subtitle,
  cta,
  ctaHref = "#",
  img,
  alt,
  align = "left",
  dark = false,
}: Props) {
  const justify =
    align === "right" ? "justify-end text-right" : align === "center" ? "justify-center text-center" : "justify-start text-left";
  return (
    <section id={id} className="relative w-full">
      <div className="relative h-[60vh] min-h-[420px] max-h-[640px] w-full overflow-hidden">
        <Image src={bannerImage(img)} alt={alt} fill className="object-cover" sizes="100vw" />
        <div className={`absolute inset-0 ${dark ? "banner-overlay-dark" : "banner-overlay-light"}`} />
        <div className="absolute inset-0">
          <div className={`container-x h-full flex items-center ${justify}`}>
            <div className={`max-w-xl text-white ${align === "right" ? "ml-auto" : ""}`}>
              <Reveal>
                <p className="kicker text-white/80 mb-4">{kicker}</p>
              </Reveal>
              <Reveal delay={120}>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.6rem] leading-[1.08] mb-5">{title}</h2>
              </Reveal>
              {subtitle && (
                <Reveal delay={200}>
                  <p className="text-base md:text-lg text-white/90 max-w-md mb-8 leading-relaxed">{subtitle}</p>
                </Reveal>
              )}
              <Reveal delay={280}>
                <a href={ctaHref} className="btn-outline-light">
                  {cta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
