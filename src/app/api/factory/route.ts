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
    return NextResponse.json(withStringIds(data));
  } catch (error) {
    console.error("Error fetching factories:", error);
    return NextResponse.json([]);
  }
}
