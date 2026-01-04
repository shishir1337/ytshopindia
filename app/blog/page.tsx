import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BlogCard } from "@/components/home/cards/blog-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog - YTShop India",
  description: "Latest insights, tips, and guides on buying and selling YouTube channels",
};

async function getBlogPosts(page: number = 1, limit: number = 12) {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        publishedAt: true,
        createdAt: true,
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({
      where: {
        published: true,
      },
    }),
  ]);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

function formatDate(date: Date | null) {
  if (!date) return "Not published";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const { posts, pagination } = await getBlogPosts(page);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-muted/30 to-background py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
              Our <span className="text-primary">Blog</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Stay updated with the latest insights, tips, and guides on buying
              and selling YouTube channels.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
                <svg
                  className="size-10 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">
                No blog posts yet
              </h2>
              <p className="text-muted-foreground">
                Check back soon for new content!
              </p>
            </div>
          ) : (
            <>
              <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <div key={post.id} className="flex">
                    <BlogCard
                      id={post.id}
                      title={post.title}
                      excerpt={post.excerpt}
                      image={post.image || "/placeholder-blog.jpg"}
                      date={formatDate(post.publishedAt)}
                      slug={post.slug}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    disabled={page === 1}
                  >
                    <Link href={`/blog?page=${page - 1}`}>
                      <ArrowLeft className="mr-2 size-4" />
                      Previous
                    </Link>
                  </Button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      // Show first, last, current, and adjacent pages
                      return (
                        p === 1 ||
                        p === pagination.totalPages ||
                        (p >= page - 1 && p <= page + 1)
                      );
                    })
                    .map((p, index, array) => {
                      const showEllipsis =
                        index > 0 && array[index - 1] !== p - 1;
                      return (
                        <div key={p} className="flex items-center gap-2">
                          {showEllipsis && (
                            <span className="px-2 text-muted-foreground">
                              ...
                            </span>
                          )}
                          <Button
                            variant={p === page ? "default" : "outline"}
                            size="sm"
                            asChild
                          >
                            <Link href={`/blog?page=${p}`}>{p}</Link>
                          </Button>
                        </div>
                      );
                    })}

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    disabled={page === pagination.totalPages}
                  >
                    <Link href={`/blog?page=${page + 1}`}>
                      Next
                      <ArrowLeft className="ml-2 size-4 rotate-180" />
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

