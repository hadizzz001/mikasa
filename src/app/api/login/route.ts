import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { verifyPassword, isValidEmail } from "../../../lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Authenticates an existing user against the `User` collection. On success the
// safe (password-free) user is returned for the client to persist locally.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!isValidEmail(email) || !password) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection("User").findOne({ email });

    if (!user || !verifyPassword(password, String(user.password))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: { _id: String(user._id), name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error signing in:", error);
    return NextResponse.json({ error: "Failed to sign in." }, { status: 500 });
  }
}
