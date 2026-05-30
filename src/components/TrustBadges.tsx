import { Truck, Undo2, ShieldCheck, Headphones } from "lucide-react";

type Badge = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href?: string;
};

const badges: Badge[] = [
  {
    icon: <Truck size={34} strokeWidth={1.5} />,
    title: "FREE SHIPPING",
    subtitle: "On orders over 50 USD",
  },
  {
    icon: <Undo2 size={34} strokeWidth={1.5} />,
    title: "EASY RETURNS",
    subtitle: "2 days return policy",
  },
  {
    icon: <ShieldCheck size={34} strokeWidth={1.5} />,
    title: "SECURE PAYMENT",
    subtitle: "100% secure checkout",
  },
  {
    icon: <Headphones size={34} strokeWidth={1.5} />,
    title: "CUSTOMER SUPPORT",
    subtitle: "We are here to help",
    href: "https://wa.me/96181543771",
  },
];

export default function TrustBadges() {
  return (
    <section className="trust-badges mt-10 mb-10" aria-label="Why shop with us">
      <div className="container-x">
        <ul className="trust-badges__list">
          {badges.map((b, i) => {
            const inner = (
              <>
                <span className="trust-badges__icon">{b.icon}</span>
                <span className="trust-badges__title">{b.title}</span>
                <span className="trust-badges__subtitle">{b.subtitle}</span>
              </>
            );
            return (
              <li key={b.title} className="trust-badges__item">
                {b.href ? (
                  <a
                    href={b.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="trust-badges__content trust-badges__content--link"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="trust-badges__content">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
