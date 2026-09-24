"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { getEffectivePrice, type Product } from "../lib/productPricing";
import { productParams, track, trackCustom } from "../lib/metaPixel";

export interface CartLine extends Product {
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartLine[] }
  | { type: "UPDATE_CART"; payload: CartLine[] }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "CLEAR_CART" };

interface CartContextValue {
  cart: CartLine[];
  addToCart: (item: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// A cart line is uniquely identified by product id + colour + size.
export const lineKeyOf = (item: { _id?: string; selectedColor?: string; selectedSize?: string }) =>
  `${item._id}__${item.selectedColor || ""}__${item.selectedSize || ""}`;

const cartReducer = (state: CartLine[], action: CartAction): CartLine[] => {
  switch (action.type) {
    case "ADD_TO_CART":
    case "UPDATE_CART":
      return action.payload;
    case "REMOVE_FROM_CART":
      return state.filter((item) => lineKeyOf(item) !== action.payload);
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], (initial: CartLine[]) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      return stored ? (JSON.parse(stored) as CartLine[]) : initial;
    }
    return initial;
  });

  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const next = cart.reduce((acc, item) => {
      const { price } = getEffectivePrice(item, item.selectedColor, item.selectedSize);
      return acc + price * (item.quantity || 1);
    }, 0);
    setSubtotal(next);
  }, [cart]);

  const addToCart = (
    item: Product,
    quantity = 1,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    let finalColor = selectedColor || "";
    let finalSize = selectedSize || "";

    if (!finalColor && item.color?.[0]?.color) finalColor = item.color[0].color;
    if (!finalSize && item.color?.[0]?.sizes?.[0]?.size) {
      finalSize = item.color[0].sizes[0].size;
    }

    track("AddToCart", productParams(item, { quantity, color: finalColor, size: finalSize }));

    const candidate = { _id: item._id, selectedColor: finalColor, selectedSize: finalSize };
    const key = lineKeyOf(candidate);
    const existing = cart.find((ci) => lineKeyOf(ci) === key);

    if (existing) {
      dispatch({
        type: "UPDATE_CART",
        payload: cart.map((ci) =>
          lineKeyOf(ci) === key ? { ...ci, quantity: ci.quantity + quantity } : ci
        ),
      });
    } else {
      const newItem: CartLine = {
        ...item,
        quantity,
        selectedColor: finalColor,
        selectedSize: finalSize,
      };
      dispatch({ type: "ADD_TO_CART", payload: [...cart, newItem] });
    }
  };

  const removeFromCart = (lineKey: string) => {
    const line = cart.find((ci) => lineKeyOf(ci) === lineKey);
    if (line) {
      trackCustom(
        "RemoveFromCart",
        productParams(line, {
          quantity: line.quantity,
          color: line.selectedColor,
          size: line.selectedSize,
        })
      );
    }
    dispatch({ type: "REMOVE_FROM_CART", payload: lineKey });
  };

  const updateQuantity = (lineKey: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({
      type: "UPDATE_CART",
      payload: cart.map((ci) => (lineKeyOf(ci) === lineKey ? { ...ci, quantity } : ci)),
    });
  };

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const totalCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, totalCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
