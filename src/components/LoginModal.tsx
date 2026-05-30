"use client";

import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function LoginModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");

  // Lock body scroll & close on Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const isLogin = mode === "login";

  return (
    <div
      className={`fixed inset-0 z-[80] transition-opacity duration-200 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Account"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Full-screen panel */}
      <div
        className={`relative h-full w-full bg-white flex flex-col transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-4"
        }`}
      >
        {/* Top bar */}
        <div className="container-x flex items-center justify-between h-20 border-b border-[var(--border)]">
          <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wider">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          <button onClick={onClose} className="icon-btn" aria-label="Close account">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="container-x flex-1 overflow-y-auto py-10">
          <div className="max-w-sm mx-auto w-full">
            <div className="flex flex-col items-center text-center gap-2 mb-8">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-alt,#f7f7f7)] flex items-center justify-center text-[var(--accent-dark)]">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
                </svg>
              </div>
              <p className="text-sm text-[var(--muted-fg)]">
                {isLogin
                  ? "Welcome back. Sign in to your Sana Home account."
                  : "Join Sana Home to save your favourites and track orders."}
              </p>
            </div>

            {/* Form (design only, no submit handling) */}
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="login-input"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="login-input"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="login-input"
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-[var(--muted-fg)]">
                    <input type="checkbox" className="accent-[var(--accent-dark)]" />
                    Remember me
                  </label>
                  <button type="button" className="text-[var(--accent-dark)] font-medium">
                    Forgot password?
                  </button>
                </div>
              )}

              <button type="submit" className="btn-primary w-full mt-2">
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            {/* Switch mode */}
            <p className="text-center text-sm text-[var(--muted-fg)] mt-6">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(isLogin ? "register" : "login")}
                className="text-[var(--accent-dark)] font-semibold"
              >
                {isLogin ? "Register" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
