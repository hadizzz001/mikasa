"use client";

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100075830274827&ref=NONE_xav_ig_profile_page_web#",
    icon: (
      <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5h1.65V4.6c-.3-.04-1.27-.13-2.4-.13-2.37 0-4 1.45-4 4.1v2.32H7.5V14h2.8v8h3.2Z" />
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/mikasahome/",
    icon: (
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.62c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.6-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.6.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.63 3.63 0 0 0-.88-1.35 3.63 3.63 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.6-.07-4.74-.07Zm0 2.76a5.3 5.3 0 1 0 0 10.6 5.3 5.3 0 0 0 0-10.6Zm0 8.74a3.44 3.44 0 1 1 0-6.88 3.44 3.44 0 0 1 0 6.88Zm6.74-8.94a1.24 1.24 0 1 1-2.48 0 1.24 1.24 0 0 1 2.48 0Z" />
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@mikasahomelebanon",
    icon: (
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.05-2.82h-2.9v11.52c0 1.37-1.12 2.48-2.5 2.48a2.49 2.49 0 0 1-2.5-2.48c0-1.37 1.12-2.48 2.5-2.48.26 0 .51.04.75.12v-2.96a5.4 5.4 0 0 0-.75-.05A5.46 5.46 0 0 0 4.7 14.52 5.46 5.46 0 0 0 10.15 20a5.46 5.46 0 0 0 5.45-5.48V8.86a7.13 7.13 0 0 0 4.2 1.35V7.3a4.27 4.27 0 0 1-3.2-1.48Z" />
    ),
  },
];

export default function Footer() {
  return (
    <footer className="sana-footer">
      <div className="sana-footer__main">
        <div className="container-x sana-footer__top">
          <div className="sana-footer__col">
            <a
              href="/about"
              className="sana-footer__heading-link sana-footer__heading-link--about"
            >
              <h4 className="sana-footer__heading">About Us</h4>
            </a>
            <p className="sana-footer__text">
              Modern Home Accessories for Peaceful Living
            </p>
          </div>

          <div className="sana-footer__col">
            <a
              href="https://wa.me/96176987808"
              target="_blank"
              rel="noopener noreferrer"
              className="sana-footer__heading-link"
            >
              <h4 className="sana-footer__heading">Contact Us</h4>
            </a>
            <ul className="sana-footer__contact">
              <li>Address: Beirut, Lebanon</li>
              <li>Phone: +961 81 543 771</li>
              <li>
                Email:{" "}
                <a href="mailto:sales.mikasahome@gmail.com">
                  sales.mikasahome@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="container-x sana-footer__follow">
          <h4 className="sana-footer__heading">Follow Us</h4>
          <ul className="sana-footer__socials" aria-label="Social media">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sana-footer__social"
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                    {s.icon}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="sana-footer__bar mb-20">
        <div className="container-x sana-footer__bar-inner flex-wrap gap-x-3 gap-y-1">
          <p>© {new Date().getFullYear()} Mikasa Home. All rights reserved.</p>
          <span aria-hidden="true">·</span>
          <a
            href="/privacy-policy"
            className="underline underline-offset-4 transition-opacity hover:opacity-100"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

