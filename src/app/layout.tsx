import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import BackButton from "../components/BackButton";
import TrustBadges from "../components/TrustBadges";
import Providers from "../components/Providers";

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
        <Providers>
          <Navbar />
          <BackButton />
          <main className="flex-1">{children}</main>
          <TrustBadges />
          <Footer />
          <a
            href="https://wa.me/96181543771"
            className="sana-whatsapp-button"
            aria-label="Chat with us on WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="#222"
              aria-hidden="true"
            >
              <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.55 0 .22 5.32.22 11.86c0 2.09.55 4.13 1.58 5.93L.12 24l6.36-1.67a11.85 11.85 0 0 0 5.6 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.14-3.43-8.42ZM12.09 21.76h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.22-3.77.99 1.01-3.67-.24-.38a9.83 9.83 0 0 1-1.51-5.24c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.11 1.03 6.97 2.89a9.78 9.78 0 0 1 2.89 6.97c0 5.43-4.42 9.85-9.81 9.85Zm5.4-7.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
            </svg>
          </a>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
