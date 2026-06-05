import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { withStringIds } from "../../../lib/withStringId";

export const dynamic = "force-dynamic";

// Category dimension for sana = the `factory` field. Returns the Factory docs
// ({ name, img[] }) used to build the shop/search filter sidebar.
export async function GET() {
  try {
    const db = await getDb();
    const data = await db.collection("Factory").find().toArray();
    // Respect the admin-defined category order: lower `sort` first, and
    // categories without a `sort` value fall to the end.
    data.sort(
      (a, b) =>
        (typeof a.sort === "number" ? a.sort : Number.MAX_SAFE_INTEGER) -
        (typeof b.sort === "number" ? b.sort : Number.MAX_SAFE_INTEGER)
    );
    return NextResponse.json(withStringIds(data));
  } catch (error) {
    console.error("Error fetching factories:", error);
    return NextResponse.json([]);
  }
}
