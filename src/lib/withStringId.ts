import { ObjectId } from "mongodb";
import { compressCloudinaryDeep } from "./cloudinaryQuality";

type WithId = Record<string, unknown> & { _id?: ObjectId | string };

/**
 * Returns the document with its `_id` converted to a plain string while
 * KEEPING the `_id` key (the storefront pages reference `item._id`). Every
 * Cloudinary image URL inside the document is also compressed (f_auto + low
 * quality) so API responses ship lightweight images everywhere.
 */
export function withStringId<T extends WithId>(doc: T): Record<string, unknown> {
  const compressed = compressCloudinaryDeep({ ...doc }) as WithId;
  return { ...compressed, _id: doc._id ? String(doc._id) : doc._id };
}

export function withStringIds<T extends WithId>(docs: T[]): Record<string, unknown>[] {
  return docs.map(withStringId);
}
