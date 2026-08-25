"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { productImage } from "../lib/cloudinaryQuality";
import { PLACEHOLDER_IMAGE } from "../lib/productPricing";
import { getJson } from "../lib/apiFetch";

type Props = {
  open: boolean;
  onClose: () => void;
};

type OrderItem = {
  title?: string;
  quantity?: number;
  price?: number;
  selectedColor?: string;
  selectedSize?: string;
  img?: string[];
};

type OrderDoc = {
  _id: string;
  oid: number;
  userInfo?: OrderItem[];
  total?: string | number;
  date?: string;
};

export default function LoginModal({ open, onClose }: Props) {
  const { user, login, logout } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

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

  // Load the signed-in customer's saved orders whenever the panel opens.
  useEffect(() => {
    if (!open || !user) {
      setOrders([]);
      return;
    }
    let active = true;
    setOrdersLoading(true);
    getJson<OrderDoc[]>(`/api/order?userId=${encodeURIComponent(user._id)}`)
      .then((d) => {
        if (active) setOrders(Array.isArray(d) ? d : []);
      })
      .finally(() => {
        if (active) setOrdersLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open, user]);

  const isLogin = mode === "login";

  const switchMode = () => {
    setMode(isLogin ? "register" : "login");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isLogin && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(isLogin ? "/api/login" : "/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin
            ? { email: trimmedEmail, password }
            : { name: name.trim(), email: trimmedEmail, password }
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }
      // Persist the user — AuthContext writes it to localStorage so access
      // survives reloads.
      login(data.user);
      setName("");
      setEmail("");
      setPassword("");
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
            {user ? "My Account" : isLogin ? "Sign In" : "Create Account"}
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
          <div className={`${user ? "max-w-2xl" : "max-w-sm"} mx-auto w-full`}>
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
                {user
                  ? `Signed in as ${user.email}`
                  : isLogin
                  ? "Welcome back. Sign in to your Mikasa Home account."
                  : "Join Mikasa Home to save your favourites and track orders."}
              </p>
            </div>

            {/* Signed-in account panel */}
            {user && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4 max-w-sm mx-auto w-full">
                  <div className="rounded-md border border-[var(--border)] bg-[var(--bg-alt,#f7f7f7)] px-4 py-3 text-center">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-[var(--muted-fg)]">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMode("login");
                    }}
                    className="btn-primary w-full"
                  >
                    Sign Out
                  </button>
                </div>

                {/* Order history */}
                <div>
                  <h3 className="text-sm font-bold tracking-[0.2em] uppercase mb-4">
                    Order History
                  </h3>

                  {ordersLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-24 rounded-lg bg-[var(--bg-alt,#f7f7f7)] animate-pulse"
                        />
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <p className="text-sm text-[var(--muted-fg)] py-8 text-center border border-dashed border-[var(--border)] rounded-lg">
                      You haven&apos;t placed any orders yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((o) => {
                        return (
                          <div
                            key={o._id}
                            className="border border-[var(--border)] rounded-lg overflow-hidden"
                          >
                            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[var(--bg-alt,#f7f7f7)]">
                              <div>
                                <p className="text-sm font-semibold">Order #{o.oid}</p>
                                {o.date && (
                                  <p className="text-xs text-[var(--muted-fg)]">{o.date}</p>
                                )}
                              </div>
                              <span className="text-sm font-semibold">${o.total}</span>
                            </div>

                            <ul className="divide-y divide-[var(--border)]">
                              {(o.userInfo || []).map((item, i) => (
                                <li key={i} className="flex items-center gap-3 px-4 py-3">
                                  <div className="relative w-12 h-14 shrink-0 rounded-md overflow-hidden bg-[var(--bg-alt,#f7f7f7)]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={productImage(item.img?.[0] || PLACEHOLDER_IMAGE)}
                                      alt={item.title || "Product"}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium capitalize line-clamp-1">
                                      {item.title}
                                    </p>
                                    <p className="text-xs text-[var(--muted-fg)]">
                                      {[item.selectedColor, item.selectedSize]
                                        .filter(Boolean)
                                        .join(" \u00b7 ")}
                                    </p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-xs text-[var(--muted-fg)]">
                                      Qty {item.quantity}
                                    </p>
                                    {typeof item.price === "number" && (
                                      <p className="text-sm font-semibold">
                                        ${item.price.toFixed(2)}
                                      </p>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Auth form */}
            {!user && (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="login-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 text-[var(--muted-fg)]">
                      <input type="checkbox" className="accent-[var(--accent-dark)]" />
                      Remember me
                    </label>
                    <button type="button" className="text-[var(--foreground)] font-semibold underline underline-offset-2 hover:text-black">
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full mt-2 disabled:opacity-60"
                >
                  {submitting
                    ? isLogin
                      ? "Signing in…"
                      : "Creating…"
                    : isLogin
                    ? "Sign In"
                    : "Create Account"}
                </button>
              </form>
            )}

            {/* Switch mode */}
            {!user && (
              <p className="text-center text-sm text-[var(--muted-fg)] mt-6">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-[var(--foreground)] font-semibold underline underline-offset-2 hover:text-black"
                >
                  {isLogin ? "Register" : "Sign In"}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
