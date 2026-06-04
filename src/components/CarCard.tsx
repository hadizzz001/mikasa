"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useFav } from "../context/FavContext";
import { useCart } from "../context/CartContext";
import { useCartBool } from "../context/CartBoolContext";
import { productImage } from "../lib/cloudinaryQuality";
import {
  type Product,
  getFirstImage,
  getSecondImage,
  getDisplayPrice,
  isProductOutOfStock,
  hasVariants,
  hasNoPrice,
  money,
} from "../lib/productPricing";

export default function CarCard({ temp }: { temp: Product }) {
  const { _id, title, type } = temp;
  const [hovered, setHovered] = useState(false);
  const { isFav, toggleFav } = useFav();
  const { addToCart, cart } = useCart();
  const { setCartOpen } = useCartBool();
  const router = useRouter();

  const favorited = isFav(_id);
  const firstImg = getFirstImage(temp);
  const hoverImg = getSecondImage(temp);
  const outOfStock = isProductOutOfStock(temp);
  const isCollection = hasVariants(temp) || type === "collection";
  const inCart = Array.isArray(cart) && cart.some((c) => c._id === _id);

  const { price, original, onSale } = getDisplayPrice(temp);
  const discountPercent =
    onSale && original > 0 ? Math.round(((original - price) / original) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;

    // Already in the cart → straight to checkout.
    if (inCart) {
      router.push("/checkout");
      return;
    }
    // Collection products need a colour/size choice → go to the product page.
    if (isCollection) {
      router.push(`/product?id=${_id}`);
      return;
    }
    addToCart(temp, 1);
    setCartOpen(true);
  };

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
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
            {temp.arrival === "yes" && (
              <span className="px-2 py-0.5 text-[0.6rem] font-bold tracking-widest uppercase bg-[var(--accent)] text-black rounded">
                New
              </span>
            )}
            {discountPercent > 0 && (
              <span className="px-2 py-0.5 text-[0.6rem] font-bold tracking-widest uppercase bg-black text-white rounded">
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

          {/* Add to cart (slides up on hover) */}
          {!outOfStock && (
            <button
              type="button"
              onClick={handleAddToCart}
              className="absolute left-3 right-3 bottom-3 z-[15] py-2.5 bg-white text-black text-xs font-semibold uppercase tracking-[0.08em] rounded-md transition-all duration-300"
              style={{
                opacity: hovered ? 1 : 0,
                transform: hovered ? "translateY(0)" : "translateY(8px)",
                pointerEvents: hovered ? "auto" : "none",
              }}
            >
              {inCart ? "Checkout Now" : isCollection ? "Choose Options" : "Add to Cart"}
            </button>
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
