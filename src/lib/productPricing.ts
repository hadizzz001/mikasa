// Centralised, mikasa-specific product helpers shared by the storefront pages,
// the product card and the cart context. The mikasa data model differs from the
// reference project: products are either `single` (top-level price/stock) or
// `collection` (a `color[]` array, each colour holding a nested `sizes[]`).

export interface SizeEntry {
  size: string;
  qty: string | number;
  price: string | number;
  discount?: string | number;
  percentage?: string | number;
}

export interface ColorEntry {
  color: string;
  colorCode?: string;
  colorImg?: string;
  images?: string[];
  sizes?: SizeEntry[];
}

export interface Product {
  _id: string;
  title?: string;
  code?: string;
  description?: string;
  price?: string | number;
  discount?: string | number;
  percentage?: string | number;
  img?: string[];
  stock?: string | number;
  stockEnabled?: boolean;
  color?: ColorEntry[];
  type?: string;
  collectionMode?: string;
  arrival?: string;
  sale?: string;
  noprice?: string | boolean;
  factory?: string;
  // Products now carry multiple categories (array). Legacy docs may still use a
  // single string. `sort` controls the admin-defined display order.
  category?: string[] | string | null;
  sort?: number | null;
  specs?: { title?: string; items?: { title?: string; value?: string }[] }[];
  // Carried on cart line items:
  quantity?: number;
  selectedColor?: string;
  selectedSize?: string;
}

export const PLACEHOLDER_IMAGE =
  "https://res.cloudinary.com/drznxpxbg/image/upload/v1781537946/571336519_838731755331159_2614331528625636359_n-removebg-preview_acuhj2.png";

export const num = (v: unknown): number => {
  const n = parseFloat(String(v ?? ""));
  return isNaN(n) ? 0 : n;
};

export const hasVariants = (item: Product): boolean =>
  Array.isArray(item.color) && item.color.length > 0;

export const getColors = (item: Product): ColorEntry[] =>
  Array.isArray(item.color) ? item.color : [];

export const hasNoPrice = (item: Product): boolean =>
  item.noprice === true || item.noprice === "yes" || item.noprice === "true";

/**
 * The categories a product belongs to. Products now carry a multi-value
 * `category` array (e.g. ["KITCHEN & DINING", "LIVING ROOM"]); older docs may
 * use a single string or only the legacy `factory` field, so normalise every
 * shape into a de-duplicated, non-empty list.
 */
export const getCategories = (item: Product): string[] => {
  const raw = Array.isArray(item.category)
    ? item.category
    : item.category
    ? [item.category]
    : [];
  const list = raw.map((c) => String(c).trim()).filter(Boolean);
  if (list.length === 0 && item.factory) list.push(item.factory);
  return Array.from(new Set(list));
};

/** Resolve the colour object to use, falling back to the first one. */
export function resolveColor(item: Product, colorName?: string): ColorEntry | undefined {
  const colors = getColors(item);
  if (colors.length === 0) return undefined;
  return colors.find((c) => c.color === colorName) || colors[0];
}

/** Resolve the size object within a colour, falling back to the first one. */
export function resolveSize(color: ColorEntry | undefined, sizeName?: string): SizeEntry | undefined {
  if (!color || !Array.isArray(color.sizes) || color.sizes.length === 0) return undefined;
  return color.sizes.find((s) => s.size === sizeName) || color.sizes[0];
}

export interface PriceInfo {
  price: number; // the price to charge
  original: number; // the pre-discount price
  onSale: boolean;
}

/**
 * Effective price for a product given an optional selected colour/size.
 * `discount` is treated as the final sale price (matches the reference model).
 */
export function getEffectivePrice(
  item: Product,
  colorName?: string,
  sizeName?: string
): PriceInfo {
  if (hasVariants(item)) {
    const color = resolveColor(item, colorName);
    const size = resolveSize(color, sizeName);
    if (size) {
      const original = num(size.price);
      const disc = num(size.discount);
      const onSale = disc > 0 && disc < original;
      return { price: onSale ? disc : original, original, onSale };
    }
  }
  const original = num(item.price);
  const disc = num(item.discount);
  const onSale = disc > 0 && disc < original;
  return { price: onSale ? disc : original, original, onSale };
}

/** Lowest available price across every colour/size — used for cards. */
export function getDisplayPrice(item: Product): PriceInfo {
  if (hasVariants(item)) {
    let best: PriceInfo | null = null;
    for (const c of getColors(item)) {
      for (const s of c.sizes || []) {
        const original = num(s.price);
        const disc = num(s.discount);
        const onSale = disc > 0 && disc < original;
        const price = onSale ? disc : original;
        if (best === null || price < best.price) best = { price, original, onSale };
      }
    }
    if (best) return best;
  }
  return getEffectivePrice(item);
}

/** First display image, optionally for a specific colour. */
export function getFirstImage(item: Product, colorName?: string): string {
  if (hasVariants(item)) {
    const color = resolveColor(item, colorName);
    if (color) {
      if (color.images && color.images.length > 0) return color.images[0];
      if (color.colorImg) return color.colorImg;
    }
  }
  if (item.img && item.img.length > 0) return item.img[0];
  return PLACEHOLDER_IMAGE;
}

/** Secondary image used for the hover swap on cards. */
export function getSecondImage(item: Product, colorName?: string): string {
  if (hasVariants(item)) {
    const color = resolveColor(item, colorName);
    if (color && color.images && color.images.length > 1) return color.images[1];
  }
  if (item.img && item.img.length > 1) return item.img[1];
  return getFirstImage(item, colorName);
}

/** All gallery images for a product/colour. */
export function getGalleryImages(item: Product, colorName?: string): string[] {
  if (hasVariants(item)) {
    const color = resolveColor(item, colorName);
    if (color) {
      const imgs = [...(color.images || [])];
      if (color.colorImg && !imgs.includes(color.colorImg)) imgs.unshift(color.colorImg);
      if (imgs.length > 0) return imgs;
    }
  }
  return item.img && item.img.length > 0 ? item.img : [PLACEHOLDER_IMAGE];
}

/** Available quantity for a single product or a colour/size combination. */
export function getAvailableQty(item: Product, colorName?: string, sizeName?: string): number {
  if (hasVariants(item)) {
    const color = resolveColor(item, colorName);
    const size = resolveSize(color, sizeName);
    return size ? num(size.qty) : 0;
  }
  return num(item.stock);
}

/**
 * Whether a product is out of stock. When `stockEnabled` is falsy the product
 * is treated as always available (stock tracking disabled).
 */
export function isProductOutOfStock(item: Product): boolean {
  if (!item.stockEnabled) return false;
  if (hasVariants(item)) {
    for (const c of getColors(item)) {
      for (const s of c.sizes || []) {
        if (num(s.qty) > 0) return false;
      }
    }
    return true;
  }
  return num(item.stock) <= 0;
}

export const money = (n: number): string => `$${n.toFixed(2)}`;
