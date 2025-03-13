import { PrismaClient } from "@prisma/client";

// ✅ Global variable to prevent multiple Prisma instances in development
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// ✅ Create a single Prisma instance
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ["query", "info", "warn", "error"], // ✅ Enable query logging for debugging
  errorFormat: "pretty", // ✅ Improve error readability
});

// ✅ Attach Prisma instance globally only in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ✅ Ensure Prisma disconnects on shutdown (Fixes stale connections)
process.on("SIGINT", async () => {
  console.log("🔌 Disconnecting Prisma...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("beforeExit", async () => {
  console.log("🔄 Cleaning up Prisma...");
  await prisma.$disconnect();
});
