import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { serialize } from "../../../lib/serialize";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const categories = await db.collection("Factory").find().toArray();
    // Lower `sort` first; categories without a `sort` value go last so the
    // admin-defined order is honoured everywhere it's consumed.
    categories.sort(
      (a, b) =>
        (typeof a.sort === "number" ? a.sort : Number.MAX_SAFE_INTEGER) -
        (typeof b.sort === "number" ? b.sort : Number.MAX_SAFE_INTEGER)
    );
    return NextResponse.json(serialize(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
