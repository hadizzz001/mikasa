import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { serialize } from "../../../lib/serialize";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const categories = await db
      .collection("Factory")
      .find()
      .sort({ sort: 1 })
      .toArray();
    return NextResponse.json(serialize(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
