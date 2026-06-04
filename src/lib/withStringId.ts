import { ObjectId } from "mongodb";

type WithId = Record<string, unknown> & { _id?: ObjectId | string };

/**
 * Returns the document with its `_id` converted to a plain string while
 * KEEPING the `_id` key (the storefront pages reference `item._id`).
 */
export function withStringId<T extends WithId>(doc: T): Record<string, unknown> {
  return { ...doc, _id: doc._id ? String(doc._id) : doc._id };
}

export function withStringIds<T extends WithId>(docs: T[]): Record<string, unknown>[] {
  return docs.map(withStringId);
}
