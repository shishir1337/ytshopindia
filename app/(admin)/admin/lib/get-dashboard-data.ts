import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const [
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    totalListings,
    pendingListings,
    approvedListings,
    recentBlogs,
    recentListings,
  ] = await Promise.all([
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.blogPost.count({ where: { published: false } }),
    prisma.channelListing.count(),
    prisma.channelListing.count({ where: { status: "pending" } }),
    prisma.channelListing.count({ where: { status: "approved" } }),
    prisma.blogPost.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.channelListing.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        sellerName: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return {
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    totalListings,
    pendingListings,
    approvedListings,
    recentBlogs,
    recentListings,
  };
}

