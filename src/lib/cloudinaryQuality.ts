// Cloudinary image compression helpers.
//
// Every transform we inject adds:
//   • f_auto  → automatically serve the most efficient format (AVIF / WebP)
//               that the requesting browser supports.
//   • q_<low> → aggressive quality compression to shrink the payload.
//
// All transforms are IDEMPOTENT: applying them more than once (e.g. once in the
// API layer and again at render time) never stacks duplicate parameters. The
// string helper also rewrites Cloudinary URLs embedded inside HTML rich-text.

// Matches a full Cloudinary delivery URL, stopping at quotes / angle brackets /
// parentheses / whitespace so it works for a bare URL *and* a URL embedded in
// an HTML attribute or CSS url().
const CLOUDINARY_UPLOAD_URL =
  /https?:\/\/res\.cloudinary\.com\/[^\s"'<>()]+?\/upload\/[^\s"'<>()]+/g;

// A Cloudinary transformation segment always begins with a short "<key>_"
// token (e.g. w_, h_, c_, q_, f_, e_ ...). Used to tell an existing transform
// segment apart from a version (v123) or a raw public-id.
const TRANSFORM_SEGMENT =
  /(^|,)(a|ar|b|bo|c|co|cs|d|dpr|du|e|eo|f|fl|g|h|l|o|p|pg|q|r|so|t|u|vc|w|x|y|z)_/;

const transformOne = (url: string, quality: number | string): string => {
  const marker = "/upload/";
  const at = url.indexOf(marker);
  if (at === -1) return url;

  const prefix = url.slice(0, at);
  const suffix = url.slice(at + marker.length); // e.g. "v123/img.jpg" or "q_70/v1/x.jpg"
  const slash = suffix.indexOf("/");
  if (slash === -1) return url;

  const firstSegment = suffix.slice(0, slash);
  const rest = suffix.slice(slash); // keeps the leading "/"
  const desired = ["f_auto", `q_${quality}`];

  // No transform segment yet (first part is a version or the public id) → insert
  // ours immediately after /upload/.
  if (/^v\d+$/.test(firstSegment) || !TRANSFORM_SEGMENT.test(firstSegment)) {
    return `${prefix}${marker}${desired.join(",")}/${suffix}`;
  }

  // Merge into the existing transform segment, dropping any previous format /
  // quality so repeated application stays idempotent.
  const kept = firstSegment
    .split(",")
    .filter(Boolean)
    .filter((part) => !/^(q|f)_/.test(part));

  return `${prefix}${marker}${[...kept, ...desired].join(",")}${rest}`;
};

/**
 * Adds aggressive `f_auto,q_<quality>` compression to every Cloudinary URL in
 * the given string (a bare URL, or HTML / CSS containing URLs). Non-Cloudinary
 * strings are returned untouched.
 */
export const cloudinaryQuality = (
  url?: string | null,
  quality: number | string = 45
): string => {
  if (!url || typeof url !== "string") return url || "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace(CLOUDINARY_UPLOAD_URL, (match) => transformOne(match, quality));
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

/**
 * Recursively walks any JSON-like value returned by an API route (object /
 * array / string) and compresses every Cloudinary URL it finds — including
 * URLs nested inside HTML rich-text fields. Dates, ObjectIds and other
 * non-plain values are passed through untouched.
 */
export const compressCloudinaryDeep = <T>(
  value: T,
  quality: number | string = 45
): T => {
  if (typeof value === "string") {
    return cloudinaryQuality(value, quality) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => compressCloudinaryDeep(item, quality)) as unknown as T;
  }
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      out[key] = compressCloudinaryDeep(val, quality);
    }
    return out as unknown as T;
  }
  return value;
};

// Convenience presets — lower number = more compression.
export const bannerImage = (url?: string | null) => cloudinaryQuality(url, 50);
export const productImage = (url?: string | null) => cloudinaryQuality(url, 40);
export const categoryImage = (url?: string | null) => cloudinaryQuality(url, 42);
export const defaultImage = (url?: string | null) => cloudinaryQuality(url, 45);
export const optimizeImage = (url?: string | null) => cloudinaryQuality(url, 45);
