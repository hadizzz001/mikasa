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

const legalLinks = ["Terms & Conditions", "Privacy Policy"];

const aboutLinks = ["About Us", "Store Location", "Design Services", "Contact Us"];

const socials = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <path d="M13 22v-9h3l1-4h-4V7a1.5 1.5 0 0 1 1.5-1.5H17V2.1A22 22 0 0 0 14.6 2C12 2 10 3.6 10 6.5V9H7v4h3v9h3Z" />
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" />
      </>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <path d="M16 3c.3 2.2 1.6 4 4 4v3c-1.5 0-2.8-.4-4-1v6.5a5.5 5.5 0 1 1-5.5-5.5c.5 0 1 .07 1.5.2v3a2.5 2.5 0 1 0 1.5 2.3V3H16Z" />
    ),
  },
  {
    label: "Pinterest",
    href: "#",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M11 22c.5-2 1-4 1.5-6.5M9 12c0-3 1.5-5 4-5s4 1.7 4 4-2 4-4.5 4c-1 0-1.6-.5-1.8-1.2" />
      </>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <>
        <rect x="2.5" y="6" width="19" height="12" rx="3" />
        <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="sana-footer">
      <div className="container-x sana-footer__top">
        <div className="sana-footer__brand">
          <h3 className="sana-footer__logo">Sana Home</h3>
          <p className="sana-footer__tagline">
            Home Décor &amp; Accessories — curated collections for the way you live.
            Beirut, Lebanon.
          </p>
          <ul className="sana-footer__about">
            {aboutLinks.map((l) => (
              <li key={l}>
                <a href="#" className="sana-footer__link">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="sana-footer__col">
          <h4 className="sana-footer__heading">Categories</h4>
          <ul className="sana-footer__cats">
            {categoryLinks.map((l) => (
              <li key={l}>
                <a href="#" className="sana-footer__link">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="sana-footer__col">
          <h4 className="sana-footer__heading">Follow Us</h4>
          <ul className="sana-footer__socials" aria-label="Social media">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="sana-footer__social"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {s.icon}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="sana-footer__bar mb-20">
        <div className="container-x sana-footer__bar-inner">
          <p>© {new Date().getFullYear()} Sana Home. All rights reserved.</p>
          <ul className="sana-footer__legal">
            {legalLinks.map((l) => (
              <li key={l}>
                <a href="#" className="sana-footer__link">{l}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
