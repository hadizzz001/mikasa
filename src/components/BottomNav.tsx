"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { House, LayoutGrid, ShoppingCart, Heart, User } from "lucide-react";
import CategoriesModal from "./CategoriesModal";
import LoginModal from "./LoginModal";
import { useCart } from "../context/CartContext";
import { useCartBool } from "../context/CartBoolContext";
import { useFav } from "../context/FavContext";
import { useFavBool } from "../context/FavBoolContext";

type ActiveKey = "home" | "categories" | "cart" | "wishlist" | "account";

export default function BottomNav() {
  const pathname = usePathname();
  const [active, setActive] = useState<ActiveKey>("home");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { totalCount } = useCart();
  const { setCartOpen } = useCartBool();
  const { favorites } = useFav();
  const { setFavOpen } = useFavBool();

  // Hide the bottom nav on single product pages, e.g. /product?id=...
  const isProductPage = pathname?.startsWith("/product");
  if (isProductPage) return null;

  // Close every modal, then optionally open one. Ensures only a single
  // modal is ever open so switching tabs swaps modals cleanly.
  const openOnly = (key: ActiveKey) => {
    setCartOpen(key === "cart");
    setCategoriesOpen(key === "categories");
    setFavOpen(key === "wishlist");
    setAccountOpen(key === "account");
  };

  const itemClass = (key: ActiveKey) =>
    `bottom-nav__item${active === key ? " bottom-nav__item--active" : ""}`;

  return (
    <>
      <nav className="bottom-nav" aria-label="Primary mobile navigation">
        <a
          href="/"
          className={itemClass("home")}
          aria-label="Home"
          onClick={() => {
            setActive("home");
            openOnly("home");
          }}
        >
          <House className="bottom-nav__icon" strokeWidth={1.6} />
          <span className="bottom-nav__label">Home</span>
        </a>

        <button
          type="button"
          className={itemClass("categories")}
          aria-label="Categories"
          onClick={() => {
            setActive("categories");
            openOnly("categories");
          }}
        >
          <LayoutGrid className="bottom-nav__icon" strokeWidth={1.6} />
          <span className="bottom-nav__label">Categories</span>
        </button>

        <button
          type="button"
          className={itemClass("cart")}
          aria-label="Cart"
          onClick={() => {
            setActive("cart");
            openOnly("cart");
          }}
        >
          <span className="relative">
            <ShoppingCart className="bottom-nav__icon" strokeWidth={1.6} />
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[var(--accent)] text-black text-[0.55rem] font-bold flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </span>
          <span className="bottom-nav__label">Cart</span>
        </button>

        <button
          type="button"
          className={itemClass("wishlist")}
          aria-label="Wishlist"
          onClick={() => {
            setActive("wishlist");
            openOnly("wishlist");
          }}
        >
          <span className="relative">
            <Heart className="bottom-nav__icon" strokeWidth={1.6} />
            {favorites.length > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[var(--accent)] text-black text-[0.55rem] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </span>
          <span className="bottom-nav__label">Wishlist</span>
        </button>

        <button
          type="button"
          className={itemClass("account")}
          aria-label="My Account"
          onClick={() => {
            setActive("account");
            openOnly("account");
          }}
        >
          <User className="bottom-nav__icon" strokeWidth={1.6} />
          <span className="bottom-nav__label">My Account</span>
        </button>
      </nav>

      <CategoriesModal
        open={categoriesOpen}
        onClose={() => setCategoriesOpen(false)}
      />
      <LoginModal open={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  );
}
