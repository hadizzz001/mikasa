"use client";

import { createContext, useContext, useState } from "react";

interface FavBoolValue {
  isFavOpen: boolean;
  setFavOpen: (v: boolean) => void;
}

const FavBoolContext = createContext<FavBoolValue | undefined>(undefined);

export const FavBoolProvider = ({ children }: { children: React.ReactNode }) => {
  const [isFavOpen, setFavOpen] = useState(false);
  return (
    <FavBoolContext.Provider value={{ isFavOpen, setFavOpen }}>
      {children}
    </FavBoolContext.Provider>
  );
};

export const useFavBool = (): FavBoolValue => {
  const ctx = useContext(FavBoolContext);
  if (!ctx) throw new Error("useFavBool must be used within a FavBoolProvider");
  return ctx;
};
