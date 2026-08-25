"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getJson } from "../lib/apiFetch";
import { Search, ChevronDown } from "lucide-react";
import SearchModal from "./SearchModal";
import { defaultImage } from "../lib/cloudinaryQuality";

type SubColumn = { title: string; href: string; items: { label: string; href: string }[] };
type MainCat = {
  label: string;
  href: string;
  badge?: "new" | "sale";
  columns?: SubColumn[];
  featured?: { title: string; subtitle: string; href: string; image: string };
};

const mainCategories: MainCat[] = [];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [factories, setFactories] = useState<{ _id: string; name: string }[]>([]);
  const [offerText, setOfferText] = useState("");
  const [shopOpen, setShopOpen] = useState(false);
  const router = useRouter();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  // Load the category list (sana `factory` field) for the Shop dropdown.
  useEffect(() => {
    getJson<{ _id: string; name: string }[]>("/api/factory").then((d) =>
      setFactories(Array.isArray(d) ? d : [])
    );
  }, []);

  // Load the announcement bar text (OfferText collection, single doc).
  useEffect(() => {
    getJson<{ text?: string }[]>("/api/txt").then((d) =>
      setOfferText(Array.isArray(d) && d[0]?.text ? d[0].text : "")
    );
  }, []);

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
    <header className="relative z-50 w-full">
      <div className="bg-[var(--accent)] text-white">
        <div className="container-x flex items-center justify-center h-9">
          <p className="text-[0.78rem] md:text-[0.82rem] font-semibold tracking-[0.12em] uppercase text-center">
            {offerText}
          </p>
        </div>
      </div>

      <div
        className={`bg-white transition-shadow ${
          scrolled ? "shadow-[0_4px_20px_-12px_rgba(0,0,0,0.18)]" : ""
        }`}
      >
        <div className="container-x flex flex-col items-center gap-4 py-5">
          <a
            href="/"
            aria-label="Mikasa Home"
            className="flex items-center shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={defaultImage(
                "https://res.cloudinary.com/drznxpxbg/image/upload/v1781537946/571336519_838731755331159_2614331528625636359_n-removebg-preview_acuhj2.png"
              )}
              alt="Mikasa Home"
              className="h-24 lg:h-40 w-auto object-contain"
            />
          </a>

          <div className="w-full max-w-2xl">
            <form onSubmit={submitSearch} className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-fg)] pointer-events-none"
                size={18}
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products, brands, categories…"
                aria-label="Search"
                className="w-full h-9 pl-11 pr-4 rounded-[var(--radius)] border border-[var(--border)] bg-white text-sm text-[var(--foreground)] placeholder:text-[var(--muted-fg)] outline-none focus:border-[var(--accent)] transition"
              />
            </form>
          </div>

          <div className="w-full border-t border-[#e5e5e5]" />

          <nav aria-label="Primary links" className="flex items-center gap-8">
            <a
              href="/search?filter=new"
              className="text-[0.82rem] font-semibold uppercase tracking-wide text-[var(--foreground)] hover:text-[var(--accent-dark)] transition-colors"
            >
              New Arrivals
            </a>

            <div
              className="relative"
              onMouseEnter={() => {
                if (shopTimer.current) clearTimeout(shopTimer.current);
                setShopOpen(true);
              }}
              onMouseLeave={() => {
                if (shopTimer.current) clearTimeout(shopTimer.current);
                shopTimer.current = setTimeout(() => setShopOpen(false), 180);
              }}
            >
              <button
                type="button"
                aria-expanded={shopOpen}
                aria-haspopup="true"
                onClick={() => {
                  if (shopTimer.current) clearTimeout(shopTimer.current);
                  setShopOpen((v) => !v);
                }}
                className="inline-flex items-center gap-1 text-[0.82rem] font-semibold uppercase tracking-wide text-[var(--foreground)] hover:text-[var(--accent-dark)] transition-colors cursor-pointer"
              >
                Shop
                <ChevronDown
                  size={15}
                  strokeWidth={2}
                  aria-hidden="true"
                  className={`transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Categories dropdown */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 transition-all duration-200 ${
                  shopOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="min-w-[230px] bg-white rounded-[var(--radius)] border border-[var(--border)] shadow-[0_25px_50px_-20px_rgba(0,0,0,0.25)] py-2">
                  <a
                    href="/shop"
                    className="block px-5 py-2.5 text-[0.8rem] font-semibold uppercase tracking-wide text-[var(--foreground)] hover:bg-[var(--surface)] hover:text-[var(--accent-dark)] transition-colors"
                  >
                    All Products
                  </a>
                  <div className="my-1 border-t border-[var(--border)]" />
                  {factories.length === 0 ? (
                    <span className="block px-5 py-2.5 text-sm text-[var(--muted-fg)]">
                      Loading…
                    </span>
                  ) : (
                    factories.map((f) => (
                      <a
                        key={f._id}
                        href={`/search?cat=${encodeURIComponent(f.name)}`}
                        className="block px-5 py-2.5 text-sm capitalize text-[var(--muted-fg)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] hover:translate-x-1 transition-all duration-150"
                      >
                        {f.name.toLowerCase()}
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>

            <a
              href="/search?filter=best"
              className="text-[0.82rem] font-semibold uppercase tracking-wide text-[var(--foreground)] hover:text-[var(--accent-dark)] transition-colors"
            >
              Best Sellers
            </a>
          </nav>
        </div>

        <nav
          className="hidden lg:block bg-white  relative"
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
                      className={`relative h-full flex items-center gap-1.5 text-[0.82rem] font-semibold tracking-wide uppercase transition-colors mynavnewnavnavnav ${
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
                        src={defaultImage(c.featured.image)}
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
        className={`sana-navbar-megamenu-backdrop hidden lg:block fixed inset-x-0 top-0 bottom-0 bg-black/30 transition-opacity duration-200 pointer-events-none ${
          activeMenu ? "opacity-100" : "opacity-0"
        }`}
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
          className={`absolute left-0 top-0 h-full w-[88%] max-w-[380px] bg-[#bea553] text-white shadow-2xl flex flex-col transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-white/30">
         
            <button
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white hover:bg-white/15 transition"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="px-5 py-4 border-b border-white/30">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2.5 border border-white/40 focus-within:border-white transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-white">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search…"
                className="flex-1 bg-transparent outline-none text-sm font-semibold placeholder:text-white/80 text-white"
              />
            </div>
          </div>

          <ul className="flex-1 overflow-y-auto px-2 py-2">
            {mainCategories.map((c) => {
              const isOpen = mobileExpanded === c.label;
              const hasMenu = !!c.columns?.length;
              return (
                <li key={c.label} className="border-b border-white/25">
                  <div className="flex items-center">
                    <a
                      href={c.href}
                      onClick={() => !hasMenu && setMobileOpen(false)}
                      className="flex-1 py-3.5 px-3 text-base uppercase tracking-wide text-white font-extrabold"
                    >
                      <span className="flex items-center gap-2">
                        {c.label}
                        {c.badge === "new" && (
                          <span className="px-1.5 py-0.5 text-[0.55rem] font-bold tracking-widest bg-white text-[#bea553] rounded">
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
                        className="px-4 py-3 text-white/90 hover:text-white"
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
                        <div className="bg-white/10 px-3 py-3 space-y-4 rounded-lg mx-1 my-2">
                          {c.columns!.map((col) => (
                            <div key={col.title}>
                              <a
                                href={col.href}
                                onClick={() => setMobileOpen(false)}
                                className="block text-xs font-extrabold tracking-[0.2em] uppercase text-white mb-2"
                              >
                                {col.title}
                              </a>
                              <ul className="flex flex-col">
                                {col.items.map((it) => (
                                  <li key={it.label}>
                                    <a
                                      href={it.href}
                                      onClick={() => setMobileOpen(false)}
                                      className="block py-1.5 text-sm font-semibold text-white hover:text-white hover:translate-x-1 transition"
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
        </aside>
      </div>

      {/* Full-screen modals */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
