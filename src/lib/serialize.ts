import { ObjectId } from "mongodb";

type Doc = Record<string, unknown> & { _id?: ObjectId };

/**
 * Converts MongoDB documents into plain JSON-friendly objects:
 * the BSON `_id` becomes a string `id` field so the response shape
 * matches what the UI components expect.
 */
export function serialize<T extends Doc>(docs: T[]): Array<Record<string, unknown>> {
  return docs.map((doc) => {
    const { _id, ...rest } = doc;
    return { id: _id ? String(_id) : undefined, ...rest };
  });
}
