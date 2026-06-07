"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Heart, Minus, Plus } from "lucide-react";
import CarCard from "../../components/CarCard";
import QuantitySelector from "../../components/QuantitySelector";
import OutOfStock from "../../components/OutOfStock";
import { useCart, lineKeyOf } from "../../context/CartContext";
import { useCartBool } from "../../context/CartBoolContext";
import { useFav } from "../../context/FavContext";
import { productImage } from "../../lib/cloudinaryQuality";
import {
  type Product,
  type ColorEntry,
  getColors,
  getCategories,
  getGalleryImages,
  getEffectivePrice,
  getAvailableQty,
  isProductOutOfStock,
  hasVariants,
  hasNoPrice,
  num,
  money,
} from "../../lib/productPricing";

// Unified pointer-based swipe (works for finger on mobile and mouse on desktop).
function useSwipe(onPrev: () => void, onNext: () => void) {
  const startX = useRef<number | null>(null);
  const moved = useRef(false);
  const SWIPE_THRESHOLD = 40; // px to count as a swipe
  const MOVE_TOLERANCE = 8; // px before we consider it a drag (suppress click)

  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      startX.current = e.clientX;
      moved.current = false;
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (startX.current === null) return;
      if (Math.abs(e.clientX - startX.current) > MOVE_TOLERANCE) moved.current = true;
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (startX.current === null) return;
      const dx = e.clientX - startX.current;
      startX.current = null;
      if (Math.abs(dx) > SWIPE_THRESHOLD) {
        if (dx < 0) onNext();
        else onPrev();
      }
    },
    onPointerCancel: () => {
      startX.current = null;
    },
  };

  return { handlers, moved };
}

function ProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { addToCart, cart } = useCart();
  const { setCartOpen } = useCartBool();
  const { isFav, toggleFav } = useFav();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [colorIdx, setColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [descOpen, setDescOpen] = useState(true);
  const [specOpen, setSpecOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        const p = Array.isArray(d) ? d[0] : d;
        setProduct(p || null);
        setColorIdx(0);
        setActiveImg(0);
        setQty(1);
        const colors = p ? getColors(p) : [];
        setSelectedSize(colors[0]?.sizes?.[0]?.size ?? "");
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Related products from the same categories (multi-category aware).
  useEffect(() => {
    if (!product) return;
    const params = new URLSearchParams();
    params.set("limit", "8");
    getCategories(product).forEach((c) => params.append("cat", c));
    fetch(`/api/productsz1?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        const list: Product[] = (d.products || []).filter((p: Product) => p._id !== product._id);
        setRelated(list.slice(0, 4));
      })
      .catch(() => setRelated([]));
  }, [product]);

  const colors = product ? getColors(product) : [];
  const variantsMode = product ? hasVariants(product) : false;
  const activeColor: ColorEntry | undefined = colors[colorIdx];
  const colorName = activeColor?.color;

  const gallery = useMemo(
    () => (product ? getGalleryImages(product, colorName) : []),
    [product, colorName]
  );

  const sizes = activeColor?.sizes?.filter((s) => s.size !== "") ?? [];
  const hasRealSizes = sizes.length > 0;

  const priceInfo = product
    ? getEffectivePrice(product, colorName, selectedSize)
    : { price: 0, original: 0, onSale: false };

  const maxQty = product
    ? product.stockEnabled
      ? getAvailableQty(product, colorName, selectedSize)
      : Infinity
    : Infinity;

  const variantOut =
    product && product.stockEnabled
      ? getAvailableQty(product, colorName, selectedSize) <= 0
      : false;
  const productOut = product ? isProductOutOfStock(product) : false;
  const outOfStock = productOut || variantOut;

  // Is the exact selected colour/size combination already in the cart?
  const inCart =
    !!product &&
    cart.some(
      (c) =>
        lineKeyOf(c) ===
        lineKeyOf({ _id: product._id, selectedColor: colorName, selectedSize })
    );

  const handleColor = (idx: number) => {
    setColorIdx(idx);
    setActiveImg(0);
    setQty(1);
    const firstReal = colors[idx]?.sizes?.find((s) => s.size !== "")?.size;
    setSelectedSize(firstReal ?? colors[idx]?.sizes?.[0]?.size ?? "");
  };

  const galleryLen = gallery.length;
  const goPrev = useCallback(
    () => setActiveImg((i) => (galleryLen ? (i - 1 + galleryLen) % galleryLen : 0)),
    [galleryLen]
  );
  const goNext = useCallback(
    () => setActiveImg((i) => (galleryLen ? (i + 1) % galleryLen : 0)),
    [galleryLen]
  );

  const mainSwipe = useSwipe(goPrev, goNext);
  const zoomSwipe = useSwipe(goPrev, goNext);

  // Keyboard navigation while the zoom lightbox is open.
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape") setZoom(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom, goPrev, goNext]);

  const handleAdd = () => {
    if (!product || outOfStock) return;
    if (variantsMode && hasRealSizes && !selectedSize) return;
    addToCart(product, qty, colorName, selectedSize);
    setCartOpen(true);
  };

  if (loading) {
    return (
      <div className="container-x py-16 grid lg:grid-cols-2 gap-12 animate-pulse">
        <div className="w-full rounded-lg bg-[#eee]" style={{ aspectRatio: "1/1" }} />
        <div className="space-y-4">
          <div className="h-8 bg-[#eee] rounded w-3/4" />
          <div className="h-6 bg-[#eee] rounded w-1/4" />
          <div className="h-24 bg-[#eee] rounded" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-x py-24 text-center">
        <p className="text-[var(--muted-fg)] mb-6">Product not found.</p>
        <Link href="/shop" className="btn-primary inline-block">Back to Shop</Link>
      </div>
    );
  }

  const favorited = isFav(product._id);

  return (
    <div className="container-x py-8 lg:py-12">
 

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Gallery */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            {gallery.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-16 h-20 shrink-0 rounded-md overflow-hidden border-2 transition ${
                      activeImg === i ? "border-[var(--accent)]" : "border-transparent"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={productImage(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div
              className="relative flex-1 rounded-lg overflow-hidden bg-[#f6f4f0] cursor-zoom-in select-none"
              style={{ aspectRatio: "1 / 1", touchAction: "pan-y" }}
              onClick={() => {
                if (mainSwipe.moved.current) {
                  mainSwipe.moved.current = false;
                  return;
                }
                setZoom(true);
              }}
              {...mainSwipe.handlers}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={productImage(gallery[activeImg] || gallery[0])}
                alt={product.title}
                draggable={false}
                className="w-full h-full object-cover object-center pointer-events-none"
              />
              {outOfStock && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white text-xs font-bold uppercase tracking-wide rounded">
                  Out of Stock
                </div>
              )}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goPrev();
                    }}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
                  >
                    <ChevronLeft size={22} strokeWidth={1.25} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                    }}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
                  >
                    <ChevronRight size={22} strokeWidth={1.25} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[var(--foreground)]/60 text-[11px] tracking-wide">
                    {activeImg + 1} / {gallery.length}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div>
          {product.code && (
            <p className="text-xs tracking-widest uppercase text-[var(--muted-fg)] mb-2">
              SKU: {product.code}
            </p>
          )}
          <h1 className="font-serif text-2xl lg:text-3xl font-bold capitalize leading-tight">
            {product.title}
          </h1>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            {hasNoPrice(product) ? (
              <span className="text-xl font-semibold text-[var(--muted-fg)]">Price on request</span>
            ) : (
              <>
                <span className="font-serif text-2xl font-bold">{money(priceInfo.price)}</span>
                {priceInfo.onSale && priceInfo.original > priceInfo.price && (
                  <span className="text-lg text-[var(--muted-fg)] line-through">
                    {money(priceInfo.original)}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Colours */}
          {variantsMode && colors.length > 0 && (
            <div className="mt-7">
              <p className="text-sm font-semibold mb-3">
                Colour: <span className="font-normal text-[var(--muted-fg)]">{colorName}</span>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleColor(i)}
                    title={c.color}
                    className={`w-9 h-9 rounded-full border transition relative ${
                      colorIdx === i ? "ring-2 ring-offset-2 ring-[var(--accent)]" : "border-[var(--border)]"
                    }`}
                    style={{ backgroundColor: c.colorCode || "#ddd" }}
                    aria-label={c.color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {variantsMode && hasRealSizes && (
            <div className="mt-7">
              <p className="text-sm font-semibold mb-3">Size</p>
              <div className="flex flex-wrap gap-2.5">
                {sizes.map((s, i) => {
                  const sizeOut = product.stockEnabled && num(s.qty) <= 0;
                  return (
                    <button
                      key={i}
                      disabled={sizeOut}
                      onClick={() => {
                        setSelectedSize(s.size);
                        setQty(1);
                      }}
                      className={`min-w-[3rem] px-4 h-11 rounded-md border text-sm font-medium transition ${
                        selectedSize === s.size
                          ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                          : "border-[var(--border)] hover:border-[var(--foreground)]"
                      } ${sizeOut ? "opacity-40 line-through cursor-not-allowed" : ""}`}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity + actions */}
          <div className="mt-8 flex flex-wrap sm:flex-nowrap items-center gap-4">
            {!outOfStock && !inCart && (
              <div className="basis-full sm:basis-auto">
                <QuantitySelector qty={qty} max={maxQty} onChange={setQty} />
              </div>
            )}
            {outOfStock ? (
              <div className="flex-1 sm:flex-none">
                <OutOfStock itemName={product.title} />
              </div>
            ) : inCart ? (
              <Link
                href="/checkout"
                className="btn-primary flex-1 sm:flex-none sm:px-12 justify-center text-center"
              >
                Checkout Now
              </Link>
            ) : (
              <button
                onClick={handleAdd}
                className="btn-primary flex-1 sm:flex-none sm:px-12 justify-center"
              >
                Add to Cart
              </button>
            )}
            <button
              onClick={() => toggleFav(product)}
              className="shrink-0 inline-flex items-center justify-center transition-colors hover:bg-[var(--surface)] h-12 w-12 rounded-md border border-[var(--border)] sm:h-10 sm:w-10 sm:rounded-full sm:border-0"
              aria-label="Add to favourites"
            >
              <Heart size={20} strokeWidth={1.7} fill={favorited ? "#222" : "none"} stroke="#222" />
            </button>
          </div>

          {product.stockEnabled && !outOfStock && maxQty !== Infinity && maxQty <= 5 && (
            <p className="mt-3 text-sm text-[var(--accent-dark)]">Only {maxQty} left in stock</p>
          )}

          {/* Description */}
          {product.description && (
            <div className="mt-10 border-t border-[var(--border)] pt-5">
              <button
                onClick={() => setDescOpen((v) => !v)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-sm font-bold tracking-wide uppercase">Description</span>
                {descOpen ? <Minus size={18} /> : <Plus size={18} />}
              </button>
              {descOpen && (
                <div
                  className="prose prose-sm max-w-none mt-4 text-[var(--muted-fg)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
            </div>
          )}

          {/* Specification */}
          {Array.isArray(product.specs) &&
            product.specs.filter((g) => g && Array.isArray(g.items) && g.items.length > 0)
              .length > 0 && (
              <div className="mt-6 border-t border-[var(--border)] pt-5">
                <button
                  onClick={() => setSpecOpen((v) => !v)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-sm font-bold tracking-wide uppercase">Specification</span>
                  {specOpen ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                {specOpen && (
                  <div className="mt-4 space-y-6">
                    {product.specs
                      .filter((g) => g && Array.isArray(g.items) && g.items.length > 0)
                      .map((group, gi) => (
                        <ul key={gi} className="space-y-2">
                          {group.items!
                            .filter((it) => it && (it.title || it.value))
                            .map((it, ii) => (
                              <li
                                key={ii}
                                className="flex items-baseline gap-3 text-sm text-[var(--muted-fg)] leading-relaxed"
                              >
                                <span className="capitalize">{it.title}</span>
                                <span className="flex-1 border-b border-dotted border-[var(--border)] translate-y-[-3px]" />
                                <span className="font-medium text-[var(--foreground)] capitalize">
                                  {it.value}
                                </span>
                              </li>
                            ))}
                        </ul>
                      ))}
                  </div>
                )}
              </div>
            )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-2xl font-bold uppercase tracking-wide text-center mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
            {related.map((p) => (
              <CarCard key={p._id} temp={p} />
            ))}
          </div>
        </section>
      )}

      {/* Zoom lightbox */}
      {zoom && (
        <div
          className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setZoom(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gallery[activeImg] || gallery[0]}
            alt={product.title}
            draggable={false}
            className="max-w-full max-h-full object-contain select-none"
            style={{ touchAction: "none" }}
            onClick={(e) => e.stopPropagation()}
            {...zoomSwipe.handlers}
          />
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous image"
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
              >
                <ChevronLeft size={28} strokeWidth={1.25} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next image"
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
              >
                <ChevronRight size={28} strokeWidth={1.25} />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs tracking-widest">
                {activeImg + 1} / {gallery.length}
              </div>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoom(false);
            }}
            className="absolute top-5 right-5 text-white"
            aria-label="Close"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="container-x py-20 text-center text-[var(--muted-fg)]">Loading…</div>}>
      <ProductContent />
    </Suspense>
  );
}
