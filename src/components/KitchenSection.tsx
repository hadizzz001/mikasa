import Reveal from "./Reveal";
import CategoryGrid from "./CategoryGrid";
import CollectionBanner from "./CollectionBanner";

const kitchenCategories = [
  { label: "Coffee, Espresso & Tea", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80" },
  { label: "Dinnerware", img: "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?auto=format&fit=crop&w=600&q=80" },
  { label: "Cutlery & Flatware", img: "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=600&q=80" },
  { label: "Storage", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80" },
  { label: "Drinkware & Bar Tools", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
  { label: "Cookware", img: "https://images.unsplash.com/photo-1584990347449-a8d4a4f0c5e4?auto=format&fit=crop&w=600&q=80" },
  { label: "Bakeware", img: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?auto=format&fit=crop&w=600&q=80" },
  { label: "Serveware", img: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=600&q=80" },
  { label: "Tools & Accessories", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80" },
  { label: "Appliances & Electrics", img: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80" },
  { label: "Table Linens", img: "https://images.unsplash.com/photo-1551806235-6692c9b2e7d9?auto=format&fit=crop&w=600&q=80" },
  { label: "Kitchen Linens", img: "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=600&q=80" },
];

export default function KitchenSection() {
  return (
    <>
      <CollectionBanner
        id="winter"
        kicker="Discover Our"
        title={
          <>
            Winter <span className="italic text-[var(--accent-light)]">Collection</span>
          </>
        }
        subtitle="Refresh your space with deep hues and modern decor."
        cta="View Collection"
        img="https://res.cloudinary.com/dh2c4clxo/image/upload/v1779542444/Winter-Collection.png_nfjdfp.webp"
        alt="Winter collection — cozy modern living room"
        dark
      />
 
    </>
  );
}
