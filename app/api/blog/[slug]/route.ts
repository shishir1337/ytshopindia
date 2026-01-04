import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get single blog post by slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        published: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        image: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get related posts (same category or recent posts)
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
        id: { not: post.id },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });

    return NextResponse.json({ post, relatedPosts });
  } catch (error: any) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

