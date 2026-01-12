-- AlterTable
ALTER TABLE "Order" ADD COLUMN "paymentMethod" TEXT;

-- CreateTable
CREATE TABLE "PaymentSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "paypalEmail" TEXT,
    "payoneerEmail" TEXT,
    "wiseDetails" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);
