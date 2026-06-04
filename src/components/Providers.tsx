"use client";

import React from "react";
import { CartProvider } from "../context/CartContext";
import { CartBoolProvider } from "../context/CartBoolContext";
import { FavProvider } from "../context/FavContext";
import { FavBoolProvider } from "../context/FavBoolContext";
import { AuthProvider } from "../context/AuthContext";
import CartModal from "./CartModal";
import WishlistModal from "./WishlistModal";

// Wraps the whole app in the cart/favourites state and renders the global
// cart + wishlist drawers exactly once.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <FavProvider>
          <CartBoolProvider>
            <FavBoolProvider>
              {children}
              <CartModal />
              <WishlistModal />
            </FavBoolProvider>
          </CartBoolProvider>
        </FavProvider>
      </CartProvider>
    </AuthProvider>
  );
}
