import { PrismaClient } from '@prisma/client';

// Check if we're using Prisma Accelerate (cloud database)
const isAccelerate = process.env.POSTGRES_URL?.includes('prisma-data.net') || 
                     process.env.POSTGRES_URL?.includes('db.prisma.io') ||
                     process.env.DATABASE_URL?.includes('prisma-data.net') ||
                     process.env.DATABASE_URL?.includes('db.prisma.io');

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (isAccelerate) {
  // Use Prisma Accelerate for cloud database
  const { withAccelerate } = require('@prisma/extension-accelerate');
  prisma = globalForPrisma.prisma || 
    new PrismaClient({
      log: ['query'],
    }).$extends(withAccelerate());
} else {
  // Use regular Prisma client for local database
  prisma = globalForPrisma.prisma || 
    new PrismaClient({
      log: ['query'],
    });
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { prisma };