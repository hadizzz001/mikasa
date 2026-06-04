import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { withStringIds } from "../../../lib/withStringId";

export const dynamic = "force-dynamic";

// Trust-badge / info sections shown above the footer.
// Each doc: { key, order, img[], title, description, url, value }.
export async function GET() {
  try {
    const db = await getDb();
    const data = await db.collection("Section").find().sort({ order: 1 }).toArray();
    return NextResponse.json(withStringIds(data));
  } catch (error) {
    console.error("Error fetching sections:", error);
    return NextResponse.json([]);
  }
}
