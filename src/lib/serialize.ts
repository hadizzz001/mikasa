import { ObjectId } from "mongodb";
import { compressCloudinaryDeep } from "./cloudinaryQuality";

type Doc = Record<string, unknown> & { _id?: ObjectId };

/**
 * Converts MongoDB documents into plain JSON-friendly objects: the BSON `_id`
 * becomes a string `id` field so the response shape matches what the UI
 * components expect. Every Cloudinary image URL in the document is also
 * compressed (f_auto + low quality) so API responses stay lightweight.
 */
export function serialize<T extends Doc>(docs: T[]): Array<Record<string, unknown>> {
  return docs.map((doc) => {
    const { _id, ...rest } = doc;
    return {
      id: _id ? String(_id) : undefined,
      ...(compressCloudinaryDeep(rest) as Record<string, unknown>),
    };
  });
}
