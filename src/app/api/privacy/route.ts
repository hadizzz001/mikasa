import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { withStringIds } from "../../../lib/withStringId";

export const dynamic = "force-dynamic";

// Privacy / delivery & returns policy content. The Privacy collection holds a
// single doc: { description (rich-text HTML) }.
export async function GET() {
  try {
    const db = await getDb();
    const data = await db.collection("Privacy").find().toArray();
    return NextResponse.json(withStringIds(data));
  } catch (error) {
    console.error("Error fetching privacy content:", error);
    return NextResponse.json([]);
  }
}
