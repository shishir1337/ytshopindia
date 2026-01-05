-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "adminWhatsapp" TEXT NOT NULL DEFAULT '+919101782780',
    "siteTitle" TEXT NOT NULL DEFAULT 'YTShop India',
    "siteDescription" TEXT DEFAULT 'Premier marketplace for buying and selling YouTube channels',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);
