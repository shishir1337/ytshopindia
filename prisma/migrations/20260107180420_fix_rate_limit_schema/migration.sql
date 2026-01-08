/*
  Warnings:

  - You are about to drop the column `createdAt` on the `rate_limit` table. All the data in the column will be lost.
  - You are about to drop the column `resetAt` on the `rate_limit` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `rate_limit` table. All the data in the column will be lost.
  - Added the required column `lastRequest` to the `rate_limit` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "rate_limit_resetAt_idx";

-- AlterTable
ALTER TABLE "rate_limit" DROP COLUMN "createdAt",
DROP COLUMN "resetAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "lastRequest" BIGINT NOT NULL;
