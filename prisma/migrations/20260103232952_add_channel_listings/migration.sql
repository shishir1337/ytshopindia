-- CreateTable
CREATE TABLE "channel_listings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "channelLink" TEXT,
    "sellerName" TEXT NOT NULL,
    "sellerEmail" TEXT NOT NULL,
    "sellerWhatsapp" TEXT NOT NULL,
    "expectedPrice" TEXT,
    "currency" TEXT NOT NULL DEFAULT '₹',
    "featuredImage" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "startDate" TIMESTAMP(3),
    "category" TEXT,
    "revenueSources" TEXT,
    "monthlyRevenue" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "listingId" TEXT,
    "subscribers" TEXT,
    "creationDate" TIMESTAMP(3),
    "language" TEXT,
    "channelType" TEXT,
    "contentType" TEXT,
    "viewsLast28Days" TEXT,
    "lifetimeViews" TEXT,
    "copyrightStrike" TEXT DEFAULT 'None',
    "communityStrike" TEXT DEFAULT 'None',
    "monetized" BOOLEAN DEFAULT false,
    "shortsViews90Days" TEXT,
    "revenueLast28Days" TEXT,
    "lifetimeRevenue" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_listings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "channel_listings_listingId_key" ON "channel_listings"("listingId");

-- CreateIndex
CREATE INDEX "channel_listings_status_idx" ON "channel_listings"("status");

-- CreateIndex
CREATE INDEX "channel_listings_listingId_idx" ON "channel_listings"("listingId");

-- CreateIndex
CREATE INDEX "channel_listings_createdAt_idx" ON "channel_listings"("createdAt");
