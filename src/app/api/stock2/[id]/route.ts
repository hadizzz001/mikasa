import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../lib/mongodb";

export const dynamic = "force-dynamic";

interface SizeEntry {
  size: string;
  qty: string | number;
}
interface ColorEntry {
  color: string;
  sizes?: SizeEntry[];
}

// Variant stock for collection products, keyed by color name + size.
// The id segment is "productId,colorName,size" (size may be empty).

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const raw = (await params).id;
  const [id, color, size = ""] = decodeURIComponent(raw).split(",");
  try {
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const db = await getDb();
    const product = await db
      .collection("Product")
      .findOne({ _id: new ObjectId(id) }, { projection: { color: 1 } });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const colors: ColorEntry[] = product.color || [];
    const colorEntry = colors.find((c) => c.color === color);
    if (!colorEntry) {
      return NextResponse.json({ error: "Color not available" }, { status: 404 });
    }
    const sizeEntry = (colorEntry.sizes || []).find((s) => s.size === size);
    if (!sizeEntry) {
      return NextResponse.json({ error: "Size not available" }, { status: 404 });
    }
    const qty = parseInt(String(sizeEntry.qty), 10);
    return NextResponse.json({ qty: isNaN(qty) ? 0 : qty });
  } catch (error) {
    console.error("Error fetching variant stock:", error);
    return NextResponse.json({ error: "Failed to fetch quantity" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { id, color, size = "", qty } = await request.json();
  try {
    const dec = parseInt(String(qty), 10);
    if (!id || !ObjectId.isValid(id) || color === undefined || isNaN(dec)) {
      return NextResponse.json({ error: "Missing or invalid params" }, { status: 400 });
    }
    const db = await getDb();
    const collection = db.collection("Product");
    const product = await collection.findOne(
      { _id: new ObjectId(id) },
      { projection: { color: 1 } }
    );
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const colors: ColorEntry[] = product.color || [];
    const colorEntry = colors.find((c) => c.color === color);
    if (!colorEntry) {
      return NextResponse.json({ error: "Color not found" }, { status: 404 });
    }
    const sizeEntry = (colorEntry.sizes || []).find((s) => s.size === size);
    if (!sizeEntry) {
      return NextResponse.json({ error: "Size not found" }, { status: 404 });
    }
    const current = parseInt(String(sizeEntry.qty), 10) || 0;
    if (current < dec) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { "color.$[c].sizes.$[s].qty": (current - dec).toString() } },
      { arrayFilters: [{ "c.color": color }, { "s.size": size }] }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating variant stock:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
