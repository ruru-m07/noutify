import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

import { env } from "@noutify/env";

import { PrismaClient } from "./../generated/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const neon = new Pool({
  connectionString: env.DATABASE_URL,
});

export const adapter = new PrismaNeon(neon);
export const prisma = new PrismaClient({ adapter });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
