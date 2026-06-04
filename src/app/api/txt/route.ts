import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { withStringIds } from "../../../lib/withStringId";

export const dynamic = "force-dynamic";

// Announcement bar text. OfferText holds a single doc ({ text }).
export async function GET() {
  try {
    const db = await getDb();
    const data = await db.collection("OfferText").find().toArray();
    return NextResponse.json(withStringIds(data));
  } catch (error) {
    console.error("Error fetching offer text:", error);
    return NextResponse.json([]);
  }
}
