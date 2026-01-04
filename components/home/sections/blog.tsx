import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BlogCard } from "@/components/home/cards/blog-card"
import { ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"

function formatDate(date: Date | null) {
  if (!date) return "Not published";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export async function Blog() {
  // Fetch latest 3 published blog posts
  const featuredBlogs = await prisma.blogPost.findMany({
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
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  if (featuredBlogs.length === 0) {
    return null; // Don't show section if no posts
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Latest <span className="text-primary">Blog Posts</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Stay updated with the latest insights, tips, and guides on buying and selling YouTube channels.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBlogs.map((blog) => (
            <div key={blog.id} className="flex">
              <BlogCard
                id={blog.id}
                title={blog.title}
                excerpt={blog.excerpt}
                image={blog.image || "/placeholder-blog.jpg"}
                date={formatDate(blog.publishedAt)}
                slug={blog.slug}
              />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <Button asChild size="lg" variant="outline" className="group">
            <Link href="/blog">
              View All Blog Posts
              <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
