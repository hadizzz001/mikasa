import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { serialize } from "../../../lib/serialize";

export const dynamic = "force-dynamic";

// Serves the Banner3 table.
export async function GET() {
  try {
    const db = await getDb();
    const banners = await db.collection("Banner3").find().toArray();
    return NextResponse.json(serialize(banners));
  } catch (error) {
    console.error("Error fetching banner3:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner3" },
      { status: 500 }
    );
  }
}
