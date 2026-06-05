import type { Metadata } from "next";
import Reveal from "../../components/Reveal";

export const metadata: Metadata = {
  title: "Privacy Policy — Sana Home",
  description:
    "Sana Home delivery, returns and exchange policy. Local delivery across Lebanon with same-day delivery in Sidon, plus our return & exchange terms.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-x py-12 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-fg)]">
              Sana Home
            </p>
            <h1 className="mt-3 font-serif text-3xl font-bold uppercase tracking-wide lg:text-4xl">
              Privacy Policy
            </h1>
          </header>
        </Reveal>

        {/* Delivery */}
        <Reveal>
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-bold uppercase tracking-wide lg:text-3xl">
              Local Delivery Across Lebanon
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--muted-fg)]">
              We provide dependable delivery services throughout Lebanon via our
              trusted delivery partners.
            </p>

            <h3 className="mt-7 text-sm font-bold uppercase tracking-[0.15em] text-[var(--foreground)]">
              Delivery Time &amp; Fees
            </h3>
            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-[var(--muted-fg)]">
              <li className="flex gap-3">
                <span aria-hidden="true" className="text-[var(--foreground)]">
                  •
                </span>
                <span>
                  <span className="font-semibold text-[var(--foreground)]">
                    Sidon:
                  </span>{" "}
                  Same-day delivery available &ndash; $3 fee
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="text-[var(--foreground)]">
                  •
                </span>
                <span>
                  <span className="font-semibold text-[var(--foreground)]">
                    Other Areas:
                  </span>{" "}
                  Delivery within 2&ndash;5 business days &ndash; $6 fee
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="text-[var(--foreground)]">
                  •
                </span>
                <span>
                  <span className="font-semibold text-[var(--foreground)]">
                    Express Delivery:
                  </span>{" "}
                  Available upon request &ndash; $8 fee (additional charges may
                  apply)
                </span>
              </li>
            </ul>
          </section>
        </Reveal>

        <hr className="my-12 border-t border-[var(--border)]" />

        {/* Returns & Exchanges */}
        <Reveal>
          <section>
            <p className="text-[15px] font-semibold leading-relaxed text-[var(--foreground)]">
              We do not provide refunds for purchased items.
            </p>

            <h2 className="mt-7 font-serif text-2xl font-bold uppercase tracking-wide lg:text-3xl">
              Return &amp; Exchange Policy
            </h2>
            <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-[var(--muted-fg)]">
              <li className="flex gap-3">
                <span aria-hidden="true" className="text-[var(--foreground)]">
                  •
                </span>
                <span>
                  Requests for exchanges or reports of defective items must be made
                  within 10 days of receiving your order.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="text-[var(--foreground)]">
                  •
                </span>
                <span>
                  Items must be unused, in original condition, and returned in their
                  original packaging.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="text-[var(--foreground)]">
                  •
                </span>
                <span>
                  A valid proof of purchase (such as an order confirmation or
                  invoice) is required.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="text-[var(--foreground)]">
                  •
                </span>
                <span>
                  We may ask for photos of the item and its packaging for
                  verification purposes.
                </span>
              </li>
            </ul>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
