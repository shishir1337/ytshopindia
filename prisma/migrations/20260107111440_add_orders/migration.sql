-- AlterTable
ALTER TABLE "site_settings" ALTER COLUMN "siteTitle" SET DEFAULT 'YT Shop India';

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "channelListingId" TEXT NOT NULL,
    "userId" TEXT,
    "guestEmail" TEXT,
    "guestName" TEXT,
    "originalPrice" TEXT NOT NULL,
    "originalCurrency" TEXT NOT NULL DEFAULT '₹',
    "amount" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "exchangeRate" DOUBLE PRECISION,
    "cryptomusInvoiceId" TEXT,
    "cryptomusOrderId" TEXT,
    "cryptomusPaymentUrl" TEXT,
    "cryptomusQrCode" TEXT,
    "paymentNetwork" TEXT,
    "paymentAddress" TEXT,
    "paymentAmount" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentStatus" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "deliveredBy" TEXT,
    "deliveryDetails" TEXT,
    "deliveryNotes" TEXT,
    "paidAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_cryptomusInvoiceId_key" ON "orders"("cryptomusInvoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_cryptomusOrderId_key" ON "orders"("cryptomusOrderId");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "orders_channelListingId_idx" ON "orders"("channelListingId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_cryptomusInvoiceId_idx" ON "orders"("cryptomusInvoiceId");

-- CreateIndex
CREATE INDEX "orders_cryptomusOrderId_idx" ON "orders"("cryptomusOrderId");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_channelListingId_fkey" FOREIGN KEY ("channelListingId") REFERENCES "channel_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
