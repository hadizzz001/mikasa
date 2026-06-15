"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, lineKeyOf, type CartLine } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { productImage } from "../../lib/cloudinaryQuality";
import {
  getFirstImage,
  getEffectivePrice,
  hasVariants,
  num,
  money,
} from "../../lib/productPricing";

const WHATSAPP_NUMBER = "96176987808";
// Delivery is cheaper for the local city (Beirut); every other city pays more.
const DELIVERY_FEE_BEIRUT = 3;
const DELIVERY_FEE_OTHER = 6;

const LEBANON_CITIES = [
  "Beirut", "Tripoli", "Sidon", "Tyre", "Jounieh", "Zahle", "Baalbek",
  "Byblos (Jbeil)", "Nabatieh", "Aley", "Baabda", "Zgharta", "Batroun",
  "Bint Jbeil", "Marjeyoun", "Hermel", "Akkar", "Chouf", "Keserwan", "Other",
];

interface Inputs {
  fname: string;
  lname: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  address: string;
  apt: string;
}

const emptyInputs: Inputs = {
  fname: "", lname: "", phone: "", email: "",
  country: "Lebanon", city: "", address: "", apt: "",
};

interface Offer {
  code: string;
  per?: string | number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();

  const [inputs, setInputs] = useState<Inputs>(emptyInputs);
  const [promo, setPromo] = useState("");
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [promoMsg, setPromoMsg] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ oid: number } | null>(null);
  // Free-shipping threshold sourced from the first trust-badge section
  // ("FREE SHIPPING", value = order amount in USD). null = no free shipping.
  const [freeShipThreshold, setFreeShipThreshold] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/section")
      .then((r) => (r.ok ? r.json() : []))
      .then((d: { order?: number; value?: string | null }[]) => {
        if (!active || !Array.isArray(d)) return;
        const first = d.find((s) => s.order === 1) ?? d[0];
        const val = num(first?.value);
        setFreeShipThreshold(val > 0 ? val : null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Prefill the email for signed-in customers (their order is also linked to
  // their profile via the user id sent with the order).
  useEffect(() => {
    if (user?.email) setInputs((p) => (p.email ? p : { ...p, email: user.email }));
  }, [user]);

  const discount = useMemo(() => {
    if (!appliedOffer) return 0;
    const per = num(appliedOffer.per);
    return per > 0 ? (subtotal * per) / 100 : 0;
  }, [appliedOffer, subtotal]);

  // Waive delivery once the order subtotal reaches the free-shipping threshold.
  const qualifiesFreeShip =
    freeShipThreshold !== null && subtotal >= freeShipThreshold;
  // Beirut ships at the discounted local rate; all other cities pay the standard fee.
  const baseDeliveryFee =
    inputs.city === "Beirut" ? DELIVERY_FEE_BEIRUT : DELIVERY_FEE_OTHER;
  const deliveryFee =
    cart.length === 0 || qualifiesFreeShip ? 0 : baseDeliveryFee;

  const total = Math.max(0, subtotal - discount) + deliveryFee;

  const set = (k: keyof Inputs, v: string) => setInputs((p) => ({ ...p, [k]: v }));

  const applyPromo = async () => {
    const code = promo.trim();
    if (!code) return;
    try {
      const res = await fetch("/api/offer");
      const offers: Offer[] = await res.json();
      const match = Array.isArray(offers)
        ? offers.find((o) => String(o.code).toLowerCase() === code.toLowerCase())
        : null;
      if (match) {
        setAppliedOffer(match);
        setPromoMsg(`Promo applied: ${num(match.per)}% off`);
      } else {
        setAppliedOffer(null);
        setPromoMsg("Invalid promo code");
      }
    } catch {
      setPromoMsg("Could not validate promo code");
    }
  };

  const validate = (): boolean => {
    const { country, city, address, fname, lname, phone, email } = inputs;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return Boolean(
      country && city && address && fname && lname && phone && (!email || emailRegex.test(email))
    );
  };

  const buildItems = () =>
    cart.map((item) => {
      const { price } = getEffectivePrice(item, item.selectedColor, item.selectedSize);
      return {
        _id: item._id,
        title: item.title,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        price,
        type: item.type,
        img: [getFirstImage(item, item.selectedColor)],
      };
    });

  const buildWhatsAppUrl = (items: ReturnType<typeof buildItems>) => {
    const { country, city, apt, address, fname, lname, phone, email } = inputs;
    const message = `
*Customer Information:*${email ? `
Email: ${email}` : ""}
Name: ${fname} ${lname}
Phone: ${phone}
Country: ${country}
City: ${city}
Address: ${address}
Apt-floor: ${apt}

*Order Details:*
${items
  .map(
    (item, i) => `
Item ${i + 1}:
- Name: ${item.title}
- Quantity: ${item.quantity}
- Price: $${item.price.toFixed(2)}${item.selectedColor ? `
- Colour: ${item.selectedColor}` : ""}${item.selectedSize ? `
- Size: ${item.selectedSize}` : ""}
- Image: ${item.img?.[0] || "No image"}`
  )
  .join("\n")}

Subtotal: $${subtotal.toFixed(2)}${discount > 0 ? `
Discount: -$${discount.toFixed(2)}` : ""}
Delivery fee: ${deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : "FREE"}
*Total Amount:* $${total.toFixed(2)}
    `.trim();
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const decrementStock = async (items: ReturnType<typeof buildItems>) => {
    for (const item of items) {
      const qty = parseInt(String(item.quantity), 10);
      const isCollection = item.type === "collection" || Boolean(item.selectedColor);
      try {
        if (isCollection && item.selectedColor !== undefined) {
          await fetch(`/api/stock2/${item._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: item._id,
              color: item.selectedColor,
              size: item.selectedSize || "",
              qty,
            }),
          });
        } else {
          await fetch(`/api/stock/${item._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qty }),
          });
        }
      } catch {
        /* best-effort stock update */
      }
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    if (!validate()) {
      setError("Please fill in all required fields with a valid format.");
      return;
    }
    setError("");
    setSubmitting(true);

    const items = buildItems();
    try {
      await decrementStock(items);

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          inputs,
          total: total.toFixed(2),
          delivery: deliveryFee,
          code: appliedOffer?.code || "",
          userId: user?._id,
          userEmail: user?.email,
          userName: user?.name,
        }),
      });
      const data = await res.json();

      // Open WhatsApp with the order summary.
      window.open(buildWhatsAppUrl(items), "_blank");

      clearCart();
      setDone({ oid: data.oid || 0 });
    } catch {
      setError("Something went wrong placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="container-x py-24 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl font-bold uppercase tracking-wide mb-3">Thank You!</h1>
        <p className="text-[var(--muted-fg)] mb-2">
          Your order{done.oid ? ` #${done.oid}` : ""} has been received.
        </p>
        <p className="text-sm text-[var(--muted-fg)] mb-8">
          We&apos;ve opened WhatsApp so you can confirm your order with our team.
        </p>
        <Link href="/shop" className="btn-primary inline-block">Continue Shopping</Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-serif text-2xl font-bold uppercase tracking-wide mb-4">Your cart is empty</h1>
        <p className="text-[var(--muted-fg)] mb-8">Add some pieces before checking out.</p>
        <Link href="/shop" className="btn-primary inline-block">Browse Products</Link>
      </div>
    );
  }

  const field =
    "w-full h-11 px-4 rounded-md border border-[var(--border)] bg-white text-sm outline-none focus:border-[var(--accent)] transition";
  const label = "block text-xs font-semibold tracking-wide uppercase text-[var(--muted-fg)] mb-1.5";

  return (
    <div className="container-x py-10 lg:py-14">
      <h1 className="font-serif text-3xl lg:text-4xl font-bold uppercase tracking-wide text-center mb-10">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-14">
        {/* Form */}
        <div>
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-5">Shipping Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>First Name *</label>
              <input className={field} value={inputs.fname} onChange={(e) => set("fname", e.target.value)} />
            </div>
            <div>
              <label className={label}>Last Name *</label>
              <input className={field} value={inputs.lname} onChange={(e) => set("lname", e.target.value)} />
            </div>
            <div>
              <label className={label}>Phone *</label>
              <input className={field} value={inputs.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+961 …" />
            </div>
            <div>
              <label className={label}>Email (optional)</label>
              <input className={field} type="email" value={inputs.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div>
              <label className={label}>Country *</label>
              <input
                className={`${field} bg-[#f3f0eb] text-[var(--muted-fg)] cursor-not-allowed`}
                value={inputs.country}
                readOnly
                aria-readonly="true"
                tabIndex={-1}
              />
            </div>
            <div>
              <label className={label}>City *</label>
              <select className={field} value={inputs.city} onChange={(e) => set("city", e.target.value)}>
                <option value="">Select city…</option>
                {LEBANON_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Address *</label>
              <input className={field} value={inputs.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, building" />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Apartment / Floor</label>
              <input className={field} value={inputs.apt} onChange={(e) => set("apt", e.target.value)} />
            </div>
          </div>

          {error && (
            <p className="mt-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
              {error}
            </p>
          )}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-6 h-fit border border-[var(--border)] rounded-lg p-6 bg-[#faf8f5]">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-5">Order Summary</h2>

          <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
            {cart.map((item: CartLine) => {
              const key = lineKeyOf(item);
              const { price } = getEffectivePrice(item, item.selectedColor, item.selectedSize);
              const max = item.stockEnabled && hasVariants(item) ? undefined : undefined;
              return (
                <div key={key} className="flex gap-3">
                  <div className="relative w-16 h-20 shrink-0 rounded-md overflow-hidden bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={productImage(getFirstImage(item, item.selectedColor))}
                      alt={item.title || ""}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[var(--accent)] text-black text-[0.65rem] font-bold flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-2">{item.title}</p>
                    <p className="text-xs text-[var(--muted-fg)]">
                      {[item.selectedColor, item.selectedSize].filter(Boolean).join(" · ")}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="inline-flex items-center border border-[var(--border)] rounded text-xs">
                        <button onClick={() => updateQuantity(key, item.quantity - 1)} disabled={item.quantity <= 1} className="w-6 h-6 disabled:opacity-40">−</button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(key, item.quantity + 1)} className="w-6 h-6" disabled={max !== undefined && item.quantity >= max}>+</button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{money(price * item.quantity)}</span>
                        <button onClick={() => removeFromCart(key)} className="text-[var(--muted-fg)] hover:text-red-500" aria-label="Remove">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Promo */}
          <div className="mt-5 pt-5 border-t border-[var(--border)]">
            <div className="flex gap-2">
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Promo code"
                className="flex-1 h-10 px-3 rounded-md border border-[var(--border)] text-sm outline-none focus:border-[var(--accent)]"
              />
              <button onClick={applyPromo} className="px-4 h-10 rounded-md border border-[var(--foreground)] text-sm font-semibold hover:bg-[var(--foreground)] hover:text-white transition">
                Apply
              </button>
            </div>
            {promoMsg && (
              <p className={`mt-2 text-xs ${appliedOffer ? "text-green-600" : "text-red-600"}`}>{promoMsg}</p>
            )}
          </div>

          {/* Totals */}
          <div className="mt-5 pt-5 border-t border-[var(--border)] space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[var(--muted-fg)]">Subtotal</span><span>{money(subtotal)}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600"><span>Discount</span><span>−{money(discount)}</span></div>
            )}
            <div className="flex justify-between">
              <span className="text-[var(--muted-fg)]">Delivery</span>
              {deliveryFee === 0 ? (
                <span className="font-semibold text-green-600">Free</span>
              ) : (
                <span>{money(deliveryFee)}</span>
              )}
            </div>
            {deliveryFee > 0 && freeShipThreshold !== null && (
              <p className="text-xs text-[var(--muted-fg)]">
                Add {money(freeShipThreshold - subtotal)} more for free shipping.
              </p>
            )}
            <div className="flex justify-between pt-2 border-t border-[var(--border)] text-base font-bold">
              <span>Total</span><span className="font-serif">{money(total)}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={submitting}
            className="btn-primary w-full mt-6 disabled:opacity-60"
          >
            {submitting ? "Placing order…" : "Place Order"}
          </button>
          <p className="mt-3 text-xs text-center text-[var(--muted-fg)]">
            You&apos;ll confirm your order with us on WhatsApp.
          </p>
        </aside>
      </div>
    </div>
  );
}
