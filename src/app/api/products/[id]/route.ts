import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../lib/mongodb";
import { withStringIds } from "../../../../lib/withStringId";

export const dynamic = "force-dynamic";

// Returns a single product as an array: [product] (matches storefront usage).
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json([]);
    }
    const db = await getDb();
    const data = await db
      .collection("Product")
      .find({ _id: new ObjectId(id) })
      .toArray();
    return NextResponse.json(withStringIds(data));
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
