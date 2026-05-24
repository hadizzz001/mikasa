"use client";

import Reveal from "./Reveal";

const BG = "https://res.cloudinary.com/dh2c4clxo/image/upload/v1779552818/newsletter_uxjzif.webp";

export default function Newsletter() {
  return (
    <section
      id="newsletterhome"
      className="relative bg-[var(--surface)] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${BG})` }}
    >
      <div className="container-x py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left: heading */}
        <Reveal>
          <h3
            className="font-semibold tracking-tight text-[var(--dark)]"
            style={{ fontSize: "clamp(1.75rem, 3.4vw, 2.4rem)", lineHeight: 1.1 }}
          >
            Subscribe to our
            <br />
            Newsletter:
          </h3>
        </Reveal>

        {/* Right: form + caption */}
        <Reveal delay={120}>
          <div className="newsletterhome">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="sib_signup_form flex flex-col sm:flex-row items-stretch gap-3"
            >
              <label htmlFor="sib-email" className="sr-only">
                Email Address
              </label>
              <input
                id="sib-email"
                type="email"
                required
                placeholder="Email Address*"
                className="sib-email-area flex-1 h-12 px-4 bg-white border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-fg)] outline-none focus:border-[var(--accent)] transition"
              />
              <button type="submit" className="btn-primary sib-default-btn h-12">
                Subscribe
              </button>
            </form>
            <p className="newsletterinfo mt-4 text-sm text-[var(--muted-fg)] leading-relaxed">
              Receive the latest news, updates, and exclusive
              <br className="hidden sm:block" /> offers directly to your inbox.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
