"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { House, LayoutGrid, ShoppingCart, Heart, User } from "lucide-react";
import CartModal from "./CartModal";
import CategoriesModal from "./CategoriesModal";
import WishlistModal from "./WishlistModal";
import LoginModal from "./LoginModal";

type ActiveKey = "home" | "categories" | "cart" | "wishlist" | "account";

export default function BottomNav() {
  const pathname = usePathname();
  const [active, setActive] = useState<ActiveKey>("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // Hide the bottom nav on single product pages, e.g. /product/[slug]
  const isProductPage = pathname?.startsWith("/product/");
  if (isProductPage) return null;

  // Close every modal, then optionally open one. Ensures only a single
  // modal is ever open so switching tabs swaps modals cleanly.
  const openOnly = (key: ActiveKey) => {
    setCartOpen(key === "cart");
    setCategoriesOpen(key === "categories");
    setWishlistOpen(key === "wishlist");
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
          <ShoppingCart className="bottom-nav__icon" strokeWidth={1.6} />
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
          <Heart className="bottom-nav__icon" strokeWidth={1.6} />
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

      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
      <CategoriesModal
        open={categoriesOpen}
        onClose={() => setCategoriesOpen(false)}
      />
      <WishlistModal open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <LoginModal open={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  );
}
