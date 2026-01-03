import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BlogCard } from "@/components/home/cards/blog-card"
import { ArrowRight } from "lucide-react"

// Dummy blog data - will be replaced with real data from CMS later
const featuredBlogs = [
  {
    id: "1",
    title: "How to Evaluate a YouTube Channel Before Buying",
    excerpt: "Learn the key metrics and factors to consider when purchasing a YouTube channel. Understand subscriber quality, engagement rates, and monetization potential.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop",
    date: "March 15, 2024",
    slug: "how-to-evaluate-youtube-channel-before-buying",
  },
  {
    id: "2",
    title: "Top 5 Mistakes to Avoid When Selling Your Channel",
    excerpt: "Discover common pitfalls that sellers encounter and how to avoid them. Get tips on pricing, documentation, and the transfer process.",
    image: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&h=450&fit=crop",
    date: "March 10, 2024",
    slug: "top-5-mistakes-avoid-selling-channel",
  },
  {
    id: "3",
    title: "Understanding YouTube Channel Analytics: A Complete Guide",
    excerpt: "Master YouTube analytics to make informed decisions. Learn about watch time, CTR, audience retention, and other crucial metrics for channel valuation.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    date: "March 5, 2024",
    slug: "understanding-youtube-channel-analytics-guide",
  },
]

export function Blog() {
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
              <BlogCard {...blog} />
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

