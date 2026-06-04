import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";

export const dynamic = "force-dynamic";

// Creates an order. Matches the sana dash schema:
//   userInfo  = the purchased line items
//   cartItems = the customer's checkout form fields
//   oid       = auto-incrementing order number starting at 1000
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inputs, items, total, delivery, code } = body;

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
