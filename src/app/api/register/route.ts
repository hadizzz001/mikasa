import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { hashPassword, isValidEmail } from "../../../lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Creates a user account. The `User` collection stores:
//   { name, email (unique, lowercased), password (scrypt hash), createdAt }
// The password is never returned to the client.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    // Validate input.
    if (!name) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection("User");

    // Enforce unique emails at the database level (idempotent).
    await collection.createIndex({ email: 1 }, { unique: true });

    // Friendly pre-check before relying on the unique index.
    const existing = await collection.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const now = new Date();
    const result = await collection.insertOne({
      name,
      email,
      password: hashPassword(password),
      createdAt: now,
    });

    // Return only safe, public fields.
    return NextResponse.json({
      success: true,
      user: { _id: String(result.insertedId), name, email },
    });
  } catch (error: unknown) {
    // Duplicate key (unique email) race condition.
    if (typeof error === "object" && error !== null && (error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
  }
}
