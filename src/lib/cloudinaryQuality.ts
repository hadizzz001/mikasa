// Append Cloudinary quality transforms to image URLs to keep payloads light.
export const cloudinaryQuality = (url?: string | null, quality = 70): string => {
  if (!url || typeof url !== "string") return url || "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;

  const [prefix, suffix] = url.split("/upload/");
  const slashIndex = suffix.indexOf("/");
  if (slashIndex === -1) return url;

  const firstSegment = suffix.slice(0, slashIndex);
  const rest = suffix.slice(slashIndex);
  const isVersionSegment = /^v\d+$/.test(firstSegment);

  if (isVersionSegment) {
    return `${prefix}/upload/q_${quality}/${suffix}`;
  }

  const transforms = firstSegment
    .split(",")
    .filter(Boolean)
    .filter((part) => !/^q_\d+$/.test(part));

  return `${prefix}/upload/${[...transforms, `q_${quality}`].join(",")}${rest}`;
};

export const bannerImage = (url?: string | null) => cloudinaryQuality(url, 75);
export const productImage = (url?: string | null) => cloudinaryQuality(url, 50);
export const categoryImage = (url?: string | null) => cloudinaryQuality(url, 50);
export const defaultImage = (url?: string | null) => cloudinaryQuality(url, 70);
