"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, lineKeyOf } from "../context/CartContext";
import { useCartBool } from "../context/CartBoolContext";
import {
  getFirstImage,
  getEffectivePrice,
  getAvailableQty,
  money,
} from "../lib/productPricing";
import { productImage } from "../lib/cloudinaryQuality";

export default function CartModal() {
  const { isCartOpen, setCartOpen } = useCartBool();
  const { cart, removeFromCart, updateQuantity, subtotal, totalCount } = useCart();
  const router = useRouter();
  const open = isCartOpen;
  const onClose = () => setCartOpen(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setCartOpen]);

  const goToCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <div
      className={`fixed inset-0 z-[80] transition-opacity duration-200 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
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
            Your Cart
            <span className="ml-2 text-sm font-normal tracking-normal text-[var(--muted-fg)]">
              ({totalCount} {totalCount === 1 ? "item" : "items"})
            </span>
          </h2>
          <button onClick={onClose} className="icon-btn" aria-label="Close cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {cart.length === 0 ? (
          <div className="flex-1 overflow-y-auto flex items-center justify-center text-center py-10 px-6">
            <div className="max-w-md mx-auto flex flex-col items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-[var(--bg-alt,#f7f7f7)] flex items-center justify-center text-[var(--muted-fg)]">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M3 4h2l2.5 12.5A2 2 0 0 0 9.46 18H18a2 2 0 0 0 2-1.6L21.5 8H6" />
                  <circle cx="9" cy="21" r="1.4" />
                  <circle cx="18" cy="21" r="1.4" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold uppercase tracking-wider">
                Your cart is empty
              </h3>
              <p className="text-sm text-[var(--muted-fg)]">
                Looks like you haven&apos;t added anything yet. Start exploring our
                collections to find pieces you&apos;ll love.
              </p>
              <button onClick={onClose} className="btn-primary mt-2">
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {cart.map((item) => {
              const key = lineKeyOf(item);
              const { price } = getEffectivePrice(item, item.selectedColor, item.selectedSize);
              const max = item.stockEnabled
                ? getAvailableQty(item, item.selectedColor, item.selectedSize)
                : Infinity;
              return (
                <div key={key} className="flex gap-4">
                  <Link
                    href={`/product?id=${item._id}`}
                    onClick={onClose}
                    className="relative w-20 h-24 shrink-0 overflow-hidden rounded-md bg-[#f7f7f7]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={productImage(getFirstImage(item, item.selectedColor))}
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
                        onClick={() => removeFromCart(key)}
                        className="text-[var(--muted-fg)] hover:text-red-500 transition shrink-0"
                        aria-label="Remove item"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-0.5 text-xs text-[var(--muted-fg)] flex gap-2">
                      {item.selectedColor && <span>{item.selectedColor}</span>}
                      {item.selectedSize && <span>· {item.selectedSize}</span>}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="inline-flex items-center border border-[var(--border)] rounded-md">
                        <button
                          onClick={() => updateQuantity(key, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(key, item.quantity + 1)}
                          disabled={item.quantity >= max}
                          className="w-8 h-8 flex items-center justify-center disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-serif font-bold text-sm">
                        {money(price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-[var(--border)] px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted-fg)]">Subtotal</span>
              <span className="font-serif font-bold text-lg">{money(subtotal)}</span>
            </div>
            <p className="text-xs text-[var(--muted-fg)] text-center">
              Shipping &amp; taxes calculated at checkout
            </p>
            <button onClick={goToCheckout} className="btn-primary w-full">
              Checkout
            </button>
            <button
              onClick={onClose}
              className="w-full text-sm text-[var(--muted-fg)] hover:text-[var(--foreground)] transition"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
