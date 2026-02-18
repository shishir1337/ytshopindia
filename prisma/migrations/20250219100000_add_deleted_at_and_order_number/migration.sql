-- Add soft delete to channel_listings
ALTER TABLE "channel_listings" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Add orderNumber to orders (nullable for backfill)
ALTER TABLE "orders" ADD COLUMN "orderNumber" INTEGER;

-- Backfill orderNumber: 12345, 12346, ... by createdAt
WITH ordered AS (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt") AS rn
  FROM "orders"
)
UPDATE "orders"
SET "orderNumber" = 12344 + ordered.rn
FROM ordered
WHERE "orders"."id" = ordered."id";

-- Unique index for orderNumber
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");
