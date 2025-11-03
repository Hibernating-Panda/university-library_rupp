import { PrismaClient } from "@prisma/client";

// Ensure a single PrismaClient instance in development to avoid hot-reload leaks
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
