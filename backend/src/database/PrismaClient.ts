import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["warn", "error"],
});

async function checkPrismaConnection() {
  try {
    await prisma.$connect();
    console.log("🔗 Connected to Prisma");
  } catch (error) {
    console.error("❌ Failed to connect to Prisma:", error);
  }
}

checkPrismaConnection();

export default prisma;
