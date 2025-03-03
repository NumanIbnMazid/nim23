import { v4 as uuidv4 } from "uuid";

/**
 * Generates a unique UUID-based slug.
 */
export function generateUUIDSlug(): string {
  return uuidv4(); // ✅ Generates a new unique UUID
}
