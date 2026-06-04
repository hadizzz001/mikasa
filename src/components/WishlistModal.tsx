"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useFav } from "../context/FavContext";
import { useFavBool } from "../context/FavBoolContext";
import { getFirstImage, getDisplayPrice, money } from "../lib/productPricing";
import { productImage } from "../lib/cloudinaryQuality";

export default function WishlistModal() {
  const { isFavOpen, setFavOpen } = useFavBool();
  const { favorites, removeFromFav } = useFav();
  const open = isFavOpen;
  const onClose = () => setFavOpen(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setFavOpen]);

  return (
    <div
      className={`fixed inset-0 z-[80] transition-opacity duration-200 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Wishlist"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-[var(--border)]">
          <h2 className="font-serif text-xl font-bold uppercase tracking-wider">
            Your Wishlist
            <span className="ml-2 text-sm font-normal tracking-normal text-[var(--muted-fg)]">
              ({favorites.length} {favorites.length === 1 ? "item" : "items"})
            </span>
          </h2>
          <button onClick={onClose} className="icon-btn" aria-label="Close wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {favorites.length === 0 ? (
          <div className="flex-1 overflow-y-auto flex items-center justify-center text-center py-10 px-6">
            <div className="max-w-md mx-auto flex flex-col items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-[var(--bg-alt,#f7f7f7)] flex items-center justify-center text-[var(--muted-fg)]">
                <Heart width={34} height={34} strokeWidth={1.4} />
              </div>
              <h3 className="font-serif text-lg font-bold uppercase tracking-wider">
                Your wishlist is empty
              </h3>
              <p className="text-sm text-[var(--muted-fg)]">
                Save the pieces you love by tapping the heart on any product, and
                they&apos;ll show up here.
              </p>
              <button onClick={onClose} className="btn-primary mt-2">
                Start Browsing
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {favorites.map((item) => {
              const { price } = getDisplayPrice(item);
              return (
                <div key={item._id} className="flex gap-4">
                  <Link
                    href={`/product?id=${item._id}`}
                    onClick={onClose}
                    className="relative w-20 h-24 shrink-0 overflow-hidden rounded-md bg-[#f7f7f7]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={productImage(getFirstImage(item))}
                      alt={item.title || "Product"}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product?id=${item._id}`}
                        onClick={onClose}
                        className="text-sm font-semibold text-[var(--foreground)] line-clamp-2 hover:text-[var(--accent-dark)]"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() => removeFromFav(item._id)}
                        className="text-[var(--muted-fg)] hover:text-red-500 transition shrink-0"
                        aria-label="Remove from wishlist"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                    <span className="mt-1 font-serif font-bold text-sm">{money(price)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-[var(--border)] px-6 py-5 flex items-center justify-center gap-2 text-sm text-[var(--muted-fg)]">
          <Heart width={16} height={16} strokeWidth={1.6} />
          <span>Your favourite pieces, saved for later</span>
        </div>
      </div>
    </div>
  );
}
