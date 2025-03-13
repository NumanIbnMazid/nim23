import { v4 as uuidv4 } from "uuid";

/**
 * Generates a unique UUID-based slug.
 */
export function generateUUIDSlug(): string {
  return uuidv4(); // ✅ Generates a new unique UUID
}

// ✅ Utility function to convert BigInt in JSON response
export function jsonBigIntReplacer(_key: string, value: any) {
  return typeof value === "bigint" ? value.toString() : value;
}