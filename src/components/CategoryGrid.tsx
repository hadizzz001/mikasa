import Image from "next/image";
import Reveal from "./Reveal";
import { categoryImage } from "../lib/cloudinaryQuality";

type Cat = { label: string; img: string };

export default function CategoryGrid({
  id,
  categories,
  columns = 5,
}: {
  id?: string;
  categories: Cat[];
  columns?: 4 | 5 | 6;
}) {
  const cols = columns === 4 ? "lg:grid-cols-4" : columns === 6 ? "lg:grid-cols-6" : "lg:grid-cols-5";
  return (
    <div id={id} className={`grid grid-cols-2 sm:grid-cols-3 ${cols} gap-x-2 gap-y-4 md:gap-y-6`}>
      {categories.map((c, i) => (
        <Reveal key={c.label} delay={i * 40}>
          <a href="#" className="category-card group">
            <div className="thumb">
              <Image
                src={categoryImage(c.img)}
                alt={c.label}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover"
              />
            </div>
            <span className="label">{c.label}</span>
            <span className="more">View Category Items ›</span>
          </a>
        </Reveal>
      ))}
    </div>
  );
}
