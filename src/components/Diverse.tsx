import Image from "next/image";
import Reveal from "./Reveal";

const diverseLinks = [
  { label: "Fashion Collection", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80" },
  { label: "Pet Accessories", img: "https://images.unsplash.com/photo-1601758174039-9b69152e6e34?auto=format&fit=crop&w=800&q=80" },
  { label: "Beauty & Health", img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80" },
  { label: "Electronics & Tech", img: "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?auto=format&fit=crop&w=800&q=80" },
  { label: "&kids", img: "https://images.unsplash.com/photo-1558877385-1c2964108940?auto=format&fit=crop&w=800&q=80" },
];

export default function Diverse() {
  return (
    <section id="diverse" className="py-16 lg:py-24 bg-white">
      <div className="container-x">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="kicker mb-3">Discover More Categories</p>
            <h2 className="section-title">
              Explore Our Diverse <br />
              <span className="italic text-[var(--accent)]">Range of Products!</span>
            </h2>
            <p className="text-[var(--muted-fg)] mt-4 max-w-xl mx-auto">
              We also have a variety of additional categories to choose from. Our diverse
              selection ensures there&apos;s something for everyone.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {diverseLinks.map((d, i) => (
            <Reveal key={d.label} delay={i * 60}>
              <a
                href="#"
                className="group relative block aspect-[3/4] overflow-hidden rounded-md"
              >
                <Image
                  src={d.img}
                  alt={d.label}
                  fill
                  sizes="(max-width:1024px) 50vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                  <span className="font-serif text-xl md:text-2xl leading-tight">{d.label}</span>
                  <span className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--accent-light)] group-hover:gap-3 transition-all">
                    Shop now <span className="text-[var(--accent)]">›</span>
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
