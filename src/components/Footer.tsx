"use client";

const categoryLinks = [
  "What's New",
  "Gift Card",
  "Back in stock",
  "Sale",
  "Décor & Pillows",
  "Storage & Organization",
  "Home & Kitchen",
  "Tabletop & Bar",
  "Bedding & Bath",
  "&kids",
  "Beauty & Health",
  "Brands",
];

const helpLinks = [
  "Shipping Info",
  "Payment Method",
  "Track Order",
  "Return & Refund Policy",
  "Terms & Conditions",
  "Privacy Policy",
  "FAQs",
];

const aboutLinks = ["About Us", "Store Location", "Design Services", "Contact Us"];

const socials = [
  { label: "Facebook", icon: <path d="M13 22v-9h3l1-4h-4V7a1.5 1.5 0 0 1 1.5-1.5H17V2.1A22 22 0 0 0 14.6 2C12 2 10 3.6 10 6.5V9H7v4h3v9h3Z" /> },
  { label: "Instagram", icon: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></> },
  { label: "TikTok", icon: <path d="M16 3c.3 2.2 1.6 4 4 4v3c-1.5 0-2.8-.4-4-1v6.5a5.5 5.5 0 1 1-5.5-5.5c.5 0 1 .07 1.5.2v3a2.5 2.5 0 1 0 1.5 2.3V3H16Z" /> },
  { label: "Pinterest", icon: <><circle cx="12" cy="12" r="9" /><path d="M11 22c.5-2 1-4 1.5-6.5M9 12c0-3 1.5-5 4-5s4 1.7 4 4-2 4-4.5 4c-1 0-1.6-.5-1.8-1.2" /></> },
  { label: "YouTube", icon: <><rect x="2.5" y="6" width="19" height="12" rx="3" /><path d="m10 9 5 3-5 3V9Z" fill="currentColor" /></> },
];

export default function Footer() {
  return (
    <footer className="bg-[#161613] text-[#cfcabf]">
      <div className="container-x py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3">
          <div className="mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
 
          </div>
          <p className="text-sm leading-relaxed mb-6 max-w-xs">
            Home Décor &amp; Accessories — curated collections for the way you live.
            Beirut, Lebanon.
          </p>
          <ul className="flex flex-col gap-1">
            {aboutLinks.map((l) => (
              <li key={l}>
                <a href="#" className="footer-link">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="text-white text-sm uppercase tracking-[0.22em] mb-5">Categories</h4>
          <ul className="grid grid-cols-2 gap-x-4">
            {categoryLinks.map((l) => (
              <li key={l}><a href="#" className="footer-link">{l}</a></li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="text-white text-sm uppercase tracking-[0.22em] mb-5">Help & Support</h4>
          <ul className="flex flex-col gap-1">
            {helpLinks.map((l) => (
              <li key={l}><a href="#" className="footer-link">{l}</a></li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="text-white text-sm uppercase tracking-[0.22em] mb-5">Newsletter</h4>
          <p className="text-sm mb-4">Subscribe for news, updates, and exclusive offers.</p>
          <form className="mb-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex items-center border-b border-white/20 focus-within:border-[var(--accent)] transition">
              <input
                type="email"
                placeholder="Email Address*"
                className="bg-transparent outline-none flex-1 py-2 text-sm placeholder:text-white/40 text-white"
              />
              <button className="text-[var(--accent)] uppercase tracking-[0.2em] text-xs hover:text-white transition">Join</button>
            </div>
          </form>

          <h4 className="text-white text-sm uppercase tracking-[0.22em] mb-4">Social Media</h4>
          <ul className="flex items-center gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-white/15 inline-flex items-center justify-center text-white/80 hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {s.icon}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Sana Home. All rights reserved.</p>
        
        </div>
      </div>
    </footer>
  );
}
