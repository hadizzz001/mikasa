import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { withStringIds } from "../../../lib/withStringId";

export const dynamic = "force-dynamic";

// About page content. The About collection holds a single doc:
// { description (rich-text HTML), img[] }.
export async function GET() {
  try {
    const db = await getDb();
    const data = await db.collection("About").find().toArray();
    return NextResponse.json(withStringIds(data));
  } catch (error) {
    console.error("Error fetching about content:", error);
    return NextResponse.json([]);
  }
}
