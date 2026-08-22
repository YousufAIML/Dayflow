<<<<<<< HEAD
import { PrismaClient } from "@prisma/client";
=======
import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
>>>>>>> b90e45727b3fd3591e7deecaf055029705888b35

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

<<<<<<< HEAD
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
=======
function createPrismaClient() {
  // PrismaNeon takes a neon Pool config (connectionString is a valid PoolConfig key)
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

/**
 * Prisma singleton with Neon WebSocket adapter (required by Prisma v7).
 * Imports from generated/prisma/client — the explicit output path required in v7.
 * Uses globalThis pattern to prevent connection pool exhaustion during dev hot reloads.
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
>>>>>>> b90e45727b3fd3591e7deecaf055029705888b35

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
<<<<<<< HEAD

export default prisma;
=======
>>>>>>> b90e45727b3fd3591e7deecaf055029705888b35
