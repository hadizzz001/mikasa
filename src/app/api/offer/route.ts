import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { withStringIds } from "../../../lib/withStringId";

export const dynamic = "force-dynamic";

// Promo codes. The sana database may not have an Offer collection yet, in which
// case this simply returns an empty array.
export async function GET() {
  try {
    const db = await getDb();
    const data = await db.collection("Offer").find().toArray();
    return NextResponse.json(withStringIds(data));
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json([]);
  }
}
