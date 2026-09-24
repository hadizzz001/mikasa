"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { Product } from "../lib/productPricing";
import { productParams, track } from "../lib/metaPixel";

type FavAction =
  | { type: "ADD_TO_FAV"; payload: Product }
  | { type: "REMOVE_FROM_FAV"; payload: string }
  | { type: "CLEAR_FAV" };

interface FavContextValue {
  favorites: Product[];
  addToFav: (product: Product) => void;
  removeFromFav: (productId: string) => void;
  toggleFav: (product: Product) => void;
  isFav: (productId: string) => boolean;
  clearFav: () => void;
}

const FavContext = createContext<FavContextValue | undefined>(undefined);

const favReducer = (state: Product[], action: FavAction): Product[] => {
  switch (action.type) {
    case "ADD_TO_FAV":
      if (state.some((item) => item._id === action.payload._id)) return state;
      return [...state, action.payload];
    case "REMOVE_FROM_FAV":
      return state.filter((item) => item._id !== action.payload);
    case "CLEAR_FAV":
      return [];
    default:
      return state;
  }
};

export const FavProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, dispatch] = useReducer(favReducer, [], (initial: Product[]) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("favorites");
      return stored ? (JSON.parse(stored) as Product[]) : initial;
    }
    return initial;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const addToFav = (product: Product) => {
    if (!favorites.some((item) => item._id === product._id)) {
      track("AddToWishlist", productParams(product));
    }
    dispatch({ type: "ADD_TO_FAV", payload: product });
  };
  const removeFromFav = (productId: string) =>
    dispatch({ type: "REMOVE_FROM_FAV", payload: productId });
  const isFav = (productId: string) => favorites.some((item) => item._id === productId);
  const toggleFav = (product: Product) =>
    isFav(product._id) ? removeFromFav(product._id) : addToFav(product);
  const clearFav = () => dispatch({ type: "CLEAR_FAV" });

  return (
    <FavContext.Provider
      value={{ favorites, addToFav, removeFromFav, toggleFav, isFav, clearFav }}
    >
      {children}
    </FavContext.Provider>
  );
};

export const useFav = (): FavContextValue => {
  const ctx = useContext(FavContext);
  if (!ctx) throw new Error("useFav must be used within a FavProvider");
  return ctx;
};
