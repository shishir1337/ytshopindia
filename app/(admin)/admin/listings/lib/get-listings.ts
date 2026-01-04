import { prisma } from "@/lib/prisma";

export interface Listing {
  id: string;
  title: string;
  listingId: string | null;
  status: string;
  sellerName: string;
  sellerEmail: string;
  category: string | null;
  subscribers: string | null;
  expectedPrice: string | null;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  approvedAt: Date | null;
}

export async function getListings(status?: string): Promise<Listing[]> {
  const where: any = {};
  if (status && status !== "all") {
    where.status = status;
  }

  const listings = await prisma.channelListing.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      listingId: true,
      status: true,
      sellerName: true,
      sellerEmail: true,
      category: true,
      subscribers: true,
      expectedPrice: true,
      currency: true,
      createdAt: true,
      updatedAt: true,
      approvedAt: true,
    },
  });

  return listings;
}

