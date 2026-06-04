import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../lib/mongodb";

export const dynamic = "force-dynamic";

// Single (non-variant) product stock. Reads/decrements the top-level `stock`.

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const db = await getDb();
    const product = await db
      .collection("Product")
      .findOne({ _id: new ObjectId(id) }, { projection: { stock: 1 } });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const stock = parseInt(String(product.stock), 10);
    return NextResponse.json({ stock: isNaN(stock) ? 0 : stock });
  } catch (error) {
    console.error("Error fetching stock:", error);
    return NextResponse.json({ error: "Failed to fetch stock" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { qty } = await request.json();
  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const db = await getDb();
    const collection = db.collection("Product");
    const product = await collection.findOne({ _id: new ObjectId(id) });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const currentStock = parseInt(String(product.stock), 10);
    const dec = parseInt(String(qty), 10);
    if (isNaN(currentStock) || isNaN(dec)) {
      return NextResponse.json({ error: "Invalid stock or quantity" }, { status: 400 });
    }
    if (currentStock < dec) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { stock: (currentStock - dec).toString() } }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 });
  }
}
