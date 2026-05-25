import Reveal from "./Reveal";

type CircleCat = {
  label: string;
  href: string;
  src: string;
};

const circleCategories: CircleCat[] = [
  {
    label: "Decor & Pillows",
    href: "#decor",
    src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1779554412/makeup_ebbdng.jpg",
  },
  {
    label: "Storage & Organization",
    href: "#storage",
    src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1779554412/bin_aokba9.jpg",
  },
  {
    label: "Home & Kitchen",
    href: "#kitchen",
    src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1779554413/office_fj2mzl.jpg",
  },
  {
    label: "Tabletop & Bar",
    href: "#tabletop",
    src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1779554412/furnt_uumhy1.jpg",
  },
  {
    label: "Bedding & Bath",
    href: "#bedding",
    src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1779554412/entry_nsrzvv.jpg",
  },
  {
    label: "&Kids",
    href: "#kids",
    src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1779554413/wall_a8ykaa.jpg",
  },
  {
    label: "Beauty & Health",
    href: "#beauty",
    src: "https://res.cloudinary.com/dh2c4clxo/image/upload/v1779554412/closet_pk4rkf.jpg",
  },
];

export default function CircleCategories() {
  return (
    <section className="sana-circle-cats" aria-label="Shop by category">
      <div className="container-x">
        <Reveal>
          <ul className="sana-circle-cats__list">
            {circleCategories.map((c) => (
              <li key={c.label} className="sana-circle-cats__item">
                <a href={c.href} className="sana-circle-cats__link">
                  <span className="sana-circle-cats__thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.src}
                      alt={c.label}
                      loading="lazy"
                      className="sana-circle-cats__img"
                    />
                  </span>
                  <span className="sana-circle-cats__label">{c.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
