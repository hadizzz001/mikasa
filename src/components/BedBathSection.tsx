import Reveal from "./Reveal";
import CategoryGrid from "./CategoryGrid";
import CollectionBanner from "./CollectionBanner";

const bedBathCategories = [
  { label: "Towels & Linens", img: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=600&q=80" },
  { label: "Bedding Essentials", img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80" },
  { label: "Bath Mirrors", img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80" },
  { label: "Cleaning & Laundry", img: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80" },
  { label: "Furniture", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80" },
  { label: "Accessories & Storage", img: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=600&q=80" },
  { label: "Fragrances", img: "https://images.unsplash.com/photo-1602874801006-7e22f4a9e6b1?auto=format&fit=crop&w=600&q=80" },
  { label: "Self-care", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80" },
];

export default function BedBathSection() {
  return (
    <>
      <CollectionBanner
        id="bedding"
        kicker="Discover Our"
        title={
          <>
            Bed & Bath <span className="italic text-[var(--accent-light)]">Collection</span>
          </>
        }
        subtitle="Refresh your home oasis with our exquisite Bed & Bath collection!"
        cta="Shop All Collection"
        img="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=2000&q=80"
        alt="Bed & bath — serene bedroom"
      />

      <section className="py-16 lg:py-24 bg-[var(--surface)]">
        <div className="container-x">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="kicker mb-3">Bed & Bath</p>
              <h2 className="section-title">
                A serene
                <span className="italic text-[var(--accent)]"> home oasis</span>
              </h2>
            </div>
          </Reveal>
          <CategoryGrid categories={bedBathCategories} columns={4} />
        </div>
      </section>
    </>
  );
}
