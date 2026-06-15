import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us — Mikasa Home",
  description:
    "Our story: established in 2026, Mikasa Home curates timeless home accessories that bring warmth, balance and modern elegance into everyday living.",
};

export default function AboutPage() {
  return <AboutContent />;
}
