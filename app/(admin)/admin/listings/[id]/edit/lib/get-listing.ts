import { prisma } from "@/lib/prisma";

export async function getListingById(id: string) {
  const listing = await prisma.channelListing.findUnique({
    where: { id },
  });

  if (!listing || listing.deletedAt) {
    return null;
  }

  return listing;
}

