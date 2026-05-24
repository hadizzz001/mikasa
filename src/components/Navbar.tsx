"use client";

import { useEffect, useRef, useState } from "react";
import SearchModal from "./SearchModal";
import CartModal from "./CartModal";

type SubColumn = { title: string; href: string; items: { label: string; href: string }[] };
type MainCat = {
  label: string;
  href: string;
  badge?: "new" | "sale";
  columns?: SubColumn[];
  featured?: { title: string; subtitle: string; href: string; image: string };
};

const mainCategories: MainCat[] = [
  {
    label: "Decor & Pillows",
    href: "#decor",
    columns: [
      {
        title: "Decor",
        href: "#decor",
        items: [
          { label: "Decorative Pillows", href: "#" },
          { label: "Throws & Blankets", href: "#" },
          { label: "Wall Decor & Art", href: "#" },
          { label: "Vases & Vessels", href: "#" },
          { label: "Candles & Fragrance", href: "#" },
          { label: "Mirrors", href: "#" },
        ],
      },
      {
        title: "Lighting",
        href: "#",
        items: [
          { label: "Table Lamps", href: "#" },
          { label: "Floor Lamps", href: "#" },
          { label: "Pendants", href: "#" },
          { label: "Lanterns", href: "#" },
        ],
      },
      {
        title: "Rugs",
        href: "#",
        items: [
          { label: "Area Rugs", href: "#" },
          { label: "Runners", href: "#" },
          { label: "Door Mats", href: "#" },
        ],
      },
    ],
    featured: {
      title: "Winter Collection",
      subtitle: "Refresh your space",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=70",
    },
  },
  {
    label: "Storage & Organization",
    href: "#storage",
    columns: [
      {
        title: "Closet & Bedroom",
        href: "#",
        items: [
          { label: "Closet Organization", href: "#" },
          { label: "Drawer Organizers", href: "#" },
          { label: "Jewelry & Makeup Storage", href: "#" },
        ],
      },
      {
        title: "Living & Entry",
        href: "#",
        items: [
          { label: "Entryway Organization", href: "#" },
          { label: "Wall Shelving", href: "#" },
          { label: "Baskets & Bins", href: "#" },
          { label: "Storage Furniture", href: "#" },
        ],
      },
      {
        title: "Office & Desk",
        href: "#",
        items: [
          { label: "Desktop Organizers", href: "#" },
          { label: "File Storage", href: "#" },
          { label: "Cable Management", href: "#" },
        ],
      },
    ],
  },
  {
    label: "Home & Kitchen",
    href: "#kitchen",
    columns: [
      {
        title: "Cookware",
        href: "#",
        items: [
          { label: "Pots & Pans", href: "#" },
          { label: "Bakeware", href: "#" },
          { label: "Cooking Utensils", href: "#" },
        ],
      },
      {
        title: "Prep & Tools",
        href: "#",
        items: [
          { label: "Knives & Cutting Boards", href: "#" },
          { label: "Measuring Tools", href: "#" },
          { label: "Kitchen Gadgets", href: "#" },
        ],
      },
      {
        title: "Food Storage",
        href: "#",
        items: [
          { label: "Containers", href: "#" },
          { label: "Pantry Storage", href: "#" },
          { label: "Wraps & Bags", href: "#" },
        ],
      },
      {
        title: "Small Appliances",
        href: "#",
        items: [
          { label: "Coffee & Tea", href: "#" },
          { label: "Blenders & Mixers", href: "#" },
          { label: "Toasters", href: "#" },
        ],
      },
    ],
  },
  {
    label: "Tabletop & Bar",
    href: "#tabletop",
    columns: [
      {
        title: "Dinnerware",
        href: "#",
        items: [
          { label: "Plates & Bowls", href: "#" },
          { label: "Serveware", href: "#" },
          { label: "Table Linens", href: "#" },
        ],
      },
      {
        title: "Drinkware",
        href: "#",
        items: [
          { label: "Glassware", href: "#" },
          { label: "Mugs & Cups", href: "#" },
          { label: "Water Bottles", href: "#" },
        ],
      },
      {
        title: "Bar",
        href: "#",
        items: [
          { label: "Bar Tools", href: "#" },
          { label: "Wine & Beer", href: "#" },
          { label: "Decanters", href: "#" },
        ],
      },
    ],
  },
  {
    label: "Bedding & Bath",
    href: "#bedding",
    columns: [
      {
        title: "Bedding",
        href: "#",
        items: [
          { label: "Duvet Covers & Sets", href: "#" },
          { label: "Sheet Sets", href: "#" },
          { label: "Pillowcases & Shams", href: "#" },
          { label: "Blankets & Throws", href: "#" },
        ],
      },
      {
        title: "Bath",
        href: "#",
        items: [
          { label: "Bath Towels", href: "#" },
          { label: "Robes & Slippers", href: "#" },
          { label: "Shower Curtains", href: "#" },
          { label: "Bath Mats", href: "#" },
        ],
      },
      {
        title: "Bath Accessories",
        href: "#",
        items: [
          { label: "Countertop Accessories", href: "#" },
          { label: "Bathroom Organizers", href: "#" },
          { label: "Wastebaskets & Hampers", href: "#" },
          { label: "Bath Fragrances", href: "#" },
        ],
      },
    ],
  },
  {
    label: "&Kids",
    href: "#kids",
    columns: [
      {
        title: "Nursery",
        href: "#",
        items: [
          { label: "Bedding", href: "#" },
          { label: "Decor", href: "#" },
          { label: "Storage", href: "#" },
        ],
      },
      {
        title: "Playroom",
        href: "#",
        items: [
          { label: "Toys & Games", href: "#" },
          { label: "Bookshelves", href: "#" },
          { label: "Rugs", href: "#" },
        ],
      },
      {
        title: "Bath & Care",
        href: "#",
        items: [
          { label: "Hooded Towels", href: "#" },
          { label: "Bath Toys", href: "#" },
        ],
      },
    ],
  },
  {
    label: "Beauty & Health",
    href: "#beauty",
    columns: [
      {
        title: "Beauty",
        href: "#",
        items: [
          { label: "Skincare", href: "#" },
          { label: "Hair Care", href: "#" },
          { label: "Makeup Tools", href: "#" },
        ],
      },
      {
        title: "Wellness",
        href: "#",
        items: [
          { label: "Aromatherapy", href: "#" },
          { label: "Sleep & Relaxation", href: "#" },
          { label: "Personal Care", href: "#" },
        ],
      },
    ],
  },
  { label: "NEW", href: "#whats-new", badge: "new" },
  {
    label: "Brands",
    href: "#brands",
    columns: [
      {
        title: "Featured Brands",
        href: "#",
        items: [
          { label: "All Brands", href: "#" },
          { label: "New to Sana Home", href: "#" },
          { label: "Exclusive Lines", href: "#" },
        ],
      },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveMenu(null), 180);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-[var(--accent)] text-white">
        <div className="container-x flex items-center justify-center h-9">
          <p className="text-[0.78rem] md:text-[0.82rem] font-semibold tracking-[0.12em] uppercase text-center">
            We have delivery on all Lebanon!
          </p>
        </div>
      </div>

      <div
        className={`bg-white transition-shadow ${
          scrolled ? "shadow-[0_4px_20px_-12px_rgba(0,0,0,0.18)]" : ""
        }`}
      >
        <div className="container-x flex items-center gap-6 h-20 relative">
          <div className="flex items-center gap-[5px]">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="nav-hamburger-mobile-only icon-btn"
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="sana-mobile-search-only icon-btn md:hidden"
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <a
            href="#"
            aria-label="Sana Home"
            className="flex items-center mr-2 shrink-0 absolute left-1/2 -translate-x-1/2 md:static md:left-auto md:translate-x-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/dh2c4clxo/image/upload/v1779535697/WhatsApp_Image_2026-05-23_at_13.45.50-removebg-preview_1_adulnl.png"
              alt="Sana Home"
              className="h-16 lg:h-20 w-auto object-contain"
            />
          </a>

          <div className="hidden md:flex flex-1 max-w-2xl">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex w-full items-center border border-[var(--border)] rounded-[var(--radius)] px-3 h-9 hover:border-[var(--accent)] transition text-left"
              aria-label="Open search"
            >
              <svg className="text-[var(--muted-fg)] mr-2 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <span className="flex-1 text-sm text-[var(--muted-fg)]">
                Search for products, brands, categories…
              </span>
            </button>
          </div>

          <div className="flex items-center gap-[5px] ml-auto">
            <a
              href="#"
              aria-label="Visit our store — Beirut, Lebanon"
              className="hidden md:inline-flex icon-btn"
              title="Visit our store"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </a>
            <a href="#" className="icon-btn" aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6.5a5.5 5.5 0 0 1 9.5 5.5C19 16.5 12 21 12 21Z" />
              </svg>
            </a>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="icon-btn relative"
              aria-label="Cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 4h2l2.5 12.5A2 2 0 0 0 9.46 18H18a2 2 0 0 0 2-1.6L21.5 8H6" />
                <circle cx="9" cy="21" r="1.4" />
                <circle cx="18" cy="21" r="1.4" />
              </svg>
              <span className="cart-badge">0</span>
            </button>
          </div>
        </div>

        <nav
          className="hidden lg:block bg-black text-white relative"
          onMouseEnter={() => {
            if (closeTimer.current) clearTimeout(closeTimer.current);
          }}
          onMouseLeave={scheduleClose}
        >
          <div className="container-x">
            <ul className="flex items-center justify-center gap-8 h-12">
              {mainCategories.map((c) => {
                const isActive = activeMenu === c.label;
                const hasMenu = !!c.columns?.length;
                return (
                  <li
                    key={c.label}
                    className="h-full flex items-center"
                    onMouseEnter={() => (hasMenu ? openMenu(c.label) : setActiveMenu(null))}
                  >
                    <a
                      href={c.href}
                      className={`relative h-full flex items-center gap-1.5 text-[0.82rem] font-semibold tracking-wide uppercase transition-colors ${
                        isActive ? "text-[var(--accent)]" : "text-white hover:text-[var(--accent)]"
                      }`}
                    >
                      {c.label}
                      {c.badge === "new" && (
                        <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[0.55rem] font-bold tracking-widest bg-[var(--accent)] text-black rounded">
                          NEW
                        </span>
                      )}
                      <span
                        className={`absolute left-0 right-0 -bottom-px h-[2px] bg-[var(--accent)] transition-transform origin-center duration-300 ${
                          isActive ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Mega menu dropdown — single panel rendered per category; positioned directly under the bar */}
          {mainCategories.map((c) => {
            if (!c.columns?.length) return null;
            const isOpen = activeMenu === c.label;
            return (
              <div
                key={`panel-${c.label}`}
                className={`absolute left-0 right-0 top-full bg-white text-[var(--foreground)] border-t border-black/10 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.25)] z-40 transition-all duration-200 ${
                  isOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="container-x py-10 grid grid-cols-12 gap-8">
                  <div className={c.featured ? "col-span-9 grid grid-cols-3 lg:grid-cols-4 gap-8" : "col-span-12 grid grid-cols-3 lg:grid-cols-4 gap-8"}>
                    {c.columns.map((col) => (
                      <div key={col.title} className="flex flex-col">
                        <a
                          href={col.href}
                          className="text-xs font-bold tracking-[0.22em] uppercase text-[var(--foreground)] mb-4 hover:text-[var(--accent-dark)] transition"
                        >
                          {col.title}
                        </a>
                        <ul className="flex flex-col gap-2.5">
                          {col.items.map((it) => (
                            <li key={it.label}>
                              <a
                                href={it.href}
                                className="text-sm text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:translate-x-1 inline-block transition-all duration-200"
                              >
                                {it.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {c.featured && (
                    <a
                      href={c.featured.href}
                      className="col-span-3 group relative overflow-hidden rounded-lg block aspect-[4/5]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.featured.image}
                        alt={c.featured.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                        <p className="text-[0.65rem] tracking-[0.25em] uppercase opacity-90 mb-1">
                          {c.featured.subtitle}
                        </p>
                        <h4 className="font-serif text-xl font-bold mb-3">{c.featured.title}</h4>
                        <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] border-b border-white/70 pb-0.5 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition">
                          Discover <span aria-hidden>→</span>
                        </span>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Backdrop for mega menu — purely decorative, no pointer handling so it doesn't fight with the panel */}
      <div
        className={`hidden lg:block fixed inset-x-0 top-0 bottom-0 bg-black/30 transition-opacity duration-200 pointer-events-none ${
          activeMenu ? "opacity-100" : "opacity-0"
        }`}
        style={{ zIndex: 30 }}
        aria-hidden
      />

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-opacity duration-200 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <aside
          className={`absolute left-0 top-0 h-full w-[88%] max-w-[380px] bg-black text-white shadow-2xl flex flex-col transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
         
            <button
              onClick={() => setMobileOpen(false)}
              className="icon-btn text-white  whitez"
              aria-label="Close menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6">
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-white/70">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search…"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/50 text-white"
              />
            </div>
          </div>

          <ul className="flex-1 overflow-y-auto px-2 py-2">
            {mainCategories.map((c) => {
              const isOpen = mobileExpanded === c.label;
              const hasMenu = !!c.columns?.length;
              return (
                <li key={c.label} className="border-b border-white/10">
                  <div className="flex items-center">
                    <a
                      href={c.href}
                      onClick={() => !hasMenu && setMobileOpen(false)}
                      className="flex-1 py-3.5 px-3 text-sm uppercase tracking-wide text-white"
                    >
                      <span className="flex items-center gap-2">
                        {c.label}
                        {c.badge === "new" && (
                          <span className="px-1.5 py-0.5 text-[0.55rem] font-bold tracking-widest bg-[var(--accent)] text-black rounded">
                            NEW
                          </span>
                        )}
                      </span>
                    </a>
                    {hasMenu && (
                      <button
                        onClick={() =>
                          setMobileExpanded(isOpen ? null : c.label)
                        }
                        aria-label={isOpen ? "Collapse" : "Expand"}
                        aria-expanded={isOpen}
                        className="px-4 py-3 text-white/80 hover:text-[var(--accent)]"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        >
                          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {hasMenu && (
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="bg-white/5 px-3 py-3 space-y-4">
                          {c.columns!.map((col) => (
                            <div key={col.title}>
                              <a
                                href={col.href}
                                onClick={() => setMobileOpen(false)}
                                className="block text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[var(--accent)] mb-2"
                              >
                                {col.title}
                              </a>
                              <ul className="flex flex-col">
                                {col.items.map((it) => (
                                  <li key={it.label}>
                                    <a
                                      href={it.href}
                                      onClick={() => setMobileOpen(false)}
                                      className="block py-1.5 text-sm text-white/80 hover:text-white"
                                    >
                                      {it.label}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="px-5 py-4 border-t border-white/10 flex items-center gap-2 text-white/80 text-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span>Beirut, Lebanon</span>
          </div>
        </aside>
      </div>

      {/* Full-screen modals */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
