"use client";

import { createContext, useContext, useState } from "react";

interface CartBoolValue {
  isCartOpen: boolean;
  setCartOpen: (v: boolean) => void;
}

const CartBoolContext = createContext<CartBoolValue | undefined>(undefined);

export const CartBoolProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCartOpen, setCartOpen] = useState(false);
  return (
    <CartBoolContext.Provider value={{ isCartOpen, setCartOpen }}>
      {children}
    </CartBoolContext.Provider>
  );
};

export const useCartBool = (): CartBoolValue => {
  const ctx = useContext(CartBoolContext);
  if (!ctx) throw new Error("useCartBool must be used within a CartBoolProvider");
  return ctx;
};
