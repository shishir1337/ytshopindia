import { prisma } from "@/lib/prisma";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getBlogPosts(published?: string | null): Promise<BlogPost[]> {
  const where: any = {};
  if (published !== null && published !== undefined && published !== "all") {
    where.published = published === "true";
  }

  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      image: true,
      published: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return posts;
}

