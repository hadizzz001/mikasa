import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { withStringIds } from "../../../lib/withStringId";

export const dynamic = "force-dynamic";

// Returns the order history for a signed-in customer (newest first). A `userId`
// query param is required; without it we return an empty list so this endpoint
// never leaks the full order book.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = (searchParams.get("userId") || "").trim();
    if (!userId) return NextResponse.json([]);

    const db = await getDb();
    const orders = await db
      .collection("Order")
      .find({ userId, delete: { $ne: true } })
      .sort({ oid: -1 })
      .toArray();

    return NextResponse.json(withStringIds(orders));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// Creates an order. Matches the sana dash schema:
//   userInfo  = the purchased line items
//   cartItems = the customer's checkout form fields
//   oid       = auto-incrementing order number starting at 1000
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inputs, items, total, delivery, code, userId, userEmail, userName } = body;

    const db = await getDb();
    const collection = db.collection("Order");

    const lastOrder = await collection.find().sort({ oid: -1 }).limit(1).toArray();
    const nextOid = lastOrder.length > 0 ? Number(lastOrder[0].oid) + 1 : 1000;

    const now = new Date();
    const formattedDate = `${now.getDate()}/${now.toLocaleString("default", {
      month: "long",
    })}/${now.getFullYear()}`;

    const result = await collection.insertOne({
      oid: nextOid,
      userInfo: items,
      cartItems: inputs,
      total,
      delivery: delivery + "",
      code,
      date: formattedDate,
      // Link the order to the signed-in customer's profile (null for guests).
      userId: userId ? String(userId) : null,
      userEmail: userEmail ? String(userEmail).toLowerCase() : null,
      userName: userName ? String(userName) : null,
      createdAt: now,
      paid: false,
      fulfillment: false,
      delete: false,
    });

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      oid: nextOid,
    });
  } catch (error) {
    console.error("Error inserting order:", error);
    return NextResponse.json({ error: "Failed to insert data" }, { status: 500 });
  }
}
