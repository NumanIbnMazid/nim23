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

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024,
    dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
