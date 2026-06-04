import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { serialize } from "../../../lib/serialize";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const banners = await db.collection("Banner").find().toArray();
    return NextResponse.json(serialize(banners));
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}
