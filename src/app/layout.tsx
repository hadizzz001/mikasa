import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Mirror site uses Raleway as both body and title font (woodmart theme defaults).
const raleway = Raleway({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
// Reuse Raleway for the "serif/display" slot so headings match the reference site.
const ralewayDisplay = Raleway({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Sana Home — Home Decor & Accessories | Beirut, Lebanon",
  description:
    "Discover home décor, kitchenware, storage, bedding and bath essentials at Sana Home. Curated collections for a beautifully styled life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} ${ralewayDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[var(--foreground)]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
