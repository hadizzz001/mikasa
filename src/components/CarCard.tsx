"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useFav } from "../context/FavContext";
import { productImage } from "../lib/cloudinaryQuality";
import {
  type Product,
  getFirstImage,
  getSecondImage,
  getDisplayPrice,
  isProductOutOfStock,
  hasNoPrice,
  money,
} from "../lib/productPricing";

export default function CarCard({
  temp,
  showNewBadge = true,
  showBestSellerBadge = true,
}: {
  temp: Product;
  showNewBadge?: boolean;
  showBestSellerBadge?: boolean;
}) {
  const { _id, title } = temp;
  const [hovered, setHovered] = useState(false);
  const { isFav, toggleFav } = useFav();

  const favorited = isFav(_id);
  const firstImg = getFirstImage(temp);
  const hoverImg = getSecondImage(temp);
  const outOfStock = isProductOutOfStock(temp);

  const { price, original, onSale } = getDisplayPrice(temp);
  const discountPercent =
    onSale && original > 0 ? Math.round(((original - price) / original) * 100) : 0;

  return (
    <Link href={`/product?id=${_id}`} className="group block">
      <div
        className="flex flex-col w-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative w-full overflow-hidden rounded-md bg-[#f6f4f0]" style={{ aspectRatio: "3 / 4" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={productImage(firstImg)}
            alt={title || "Product"}
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500"
            style={{ opacity: hovered ? 0 : 1 }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={productImage(hoverImg)}
            alt={title || "Product"}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out"
            style={{ opacity: hovered ? 1 : 0, transform: hovered ? "scale(1.08)" : "scale(1)" }}
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1 items-start">
            {showNewBadge && temp.arrival === "yes" && (
              <span className="px-1.5 py-px text-[9px] font-semibold tracking-[0.12em] uppercase bg-[var(--accent)] text-black">
                New
              </span>
            )}
            {showBestSellerBadge && temp.sale === "yes" && (
              <span className="px-1.5 py-px text-[9px] font-semibold tracking-[0.12em] uppercase bg-[var(--accent)] text-black">
                Best Seller
              </span>
            )}
            {discountPercent > 0 && (
              <span className="px-1.5 py-px text-[9px] font-semibold tracking-[0.12em] uppercase bg-black text-white">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Favourite */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFav(temp);
            }}
            className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/85 backdrop-blur-sm hover:bg-white transition shadow-sm"
            aria-label="Add to favourites"
          >
            <Heart size={18} strokeWidth={1.7} fill={favorited ? "#222" : "none"} stroke="#222" />
          </button>

          {/* Out of stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-base font-bold tracking-wider uppercase z-10">
              Out of Stock
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col items-start mt-3 w-full text-left">
          <h3 className="text-sm font-semibold text-[var(--foreground)] capitalize line-clamp-2">
            {title}
          </h3>
          {hasNoPrice(temp) ? (
            <span className="mt-1 text-sm font-semibold text-[var(--muted-fg)]">Price on request</span>
          ) : (
            <div className="mt-1 inline-flex flex-wrap gap-x-2 items-baseline">
              <span className="font-serif font-bold text-[var(--foreground)]">{money(price)}</span>
              {onSale && original > price && (
                <span className="text-sm text-[var(--muted-fg)] line-through">{money(original)}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
