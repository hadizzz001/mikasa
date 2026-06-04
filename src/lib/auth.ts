import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// Lightweight password hashing using Node's built-in scrypt so we don't pull in
// an extra dependency. The stored value is "salt:hash" (both hex encoded).

const KEYLEN = 64;

/** Hash a plaintext password into a salted scrypt digest ("salt:hash"). */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEYLEN).toString("hex");
  return `${salt}:${hash}`;
}

/** Verify a plaintext password against a stored "salt:hash" digest. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = (stored || "").split(":");
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, "hex");
  const testBuf = scryptSync(password, salt, KEYLEN);
  return hashBuf.length === testBuf.length && timingSafeEqual(hashBuf, testBuf);
}

/** Basic email shape validation. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
