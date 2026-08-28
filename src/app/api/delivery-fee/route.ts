import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { withStringIds } from "../../../lib/withStringId";

export const dynamic = "force-dynamic";

// Delivery fee configured from the dashboard. DeliveryFee holds a single doc ({ fee }).
export async function GET() {
  try {
    const db = await getDb();
    const data = await db.collection("DeliveryFee").find().toArray();
    return NextResponse.json(withStringIds(data));
  } catch (error) {
    console.error("Error fetching delivery fee:", error);
    return NextResponse.json([]);
  }
}
