import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { withStringIds } from "../../../lib/withStringId";

export const dynamic = "force-dynamic";

// Returns every product (newest first), with `_id` as a string.
export async function GET() {
  try {
    const db = await getDb();
    const data = await db.collection("Product").find().sort({ _id: -1 }).toArray();
    return NextResponse.json(withStringIds(data));
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
