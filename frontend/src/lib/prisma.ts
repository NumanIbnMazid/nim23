import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// ✅ Create a single instance of Prisma Client
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ✅ Ensure Prisma disconnects when the app shuts down
process.on("SIGINT", async () => {
  console.log("🔌 Disconnecting Prisma...");
  await prisma.$disconnect();
  process.exit(0);
});
