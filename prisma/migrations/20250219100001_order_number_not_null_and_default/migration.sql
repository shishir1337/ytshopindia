-- Sequence for new order numbers (starts after backfilled max)
CREATE SEQUENCE IF NOT EXISTS "order_number_seq" START WITH 12345;

-- Set sequence to max existing orderNumber + 1 so new orders get correct next value
SELECT setval('order_number_seq', (SELECT COALESCE(MAX("orderNumber"), 12344) FROM "orders") + 1);

-- Make orderNumber required and default to next sequence value for new rows
ALTER TABLE "orders" ALTER COLUMN "orderNumber" SET NOT NULL;
ALTER TABLE "orders" ALTER COLUMN "orderNumber" SET DEFAULT nextval('order_number_seq');
