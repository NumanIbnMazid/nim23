import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// ✅ Use connection pooling with Prisma
export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL },
  },
  // log: ["query", "info", "warn", "error"], // ✅ Enable Prisma logs for debugging
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ✅ Gracefully close Prisma connection on shutdown
process.on("SIGINT", async () => {
  console.log("🔌 Disconnecting Prisma...");
  await prisma.$disconnect();
  process.exit(0);
});
