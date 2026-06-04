import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { withStringIds } from "../../../lib/withStringId";

export const dynamic = "force-dynamic";

// Returns the Color palette. In sana each Color doc is { name, code, img[] }
// where `code` is the hex value.
export async function GET() {
  try {
    const db = await getDb();
    const data = await db.collection("Color").find().sort({ name: 1 }).toArray();
    return NextResponse.json(withStringIds(data));
  } catch (error) {
    console.error("Error fetching colors:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
