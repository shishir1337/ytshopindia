import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BlogCard } from "@/components/home/cards/blog-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string) {
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
    return null;
  }

  // Get related posts
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

  return { post, relatedPosts };
}

function formatDate(date: Date | null) {
  if (!date) return "Not published";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatReadingTime(content: string) {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBlogPost(slug);

  if (!data) {
    return {
      title: "Post Not Found - YTShop India",
    };
  }

  return {
    title: `${data.post.title} - YTShop India Blog`,
    description: data.post.excerpt,
    openGraph: {
      title: data.post.title,
      description: data.post.excerpt,
      images: data.post.image ? [data.post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const data = await getBlogPost(slug);

  if (!data) {
    notFound();
  }

  const { post, relatedPosts } = data;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 size-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>

      <article className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <header className="mb-8">
              <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <p className="mb-6 text-xl text-muted-foreground">
                {post.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <time dateTime={post.publishedAt?.toISOString()}>
                    {formatDate(post.publishedAt)}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span>{formatReadingTime(post.content)}</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.image && (
              <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-xl border border-border">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-img:rounded-lg prose-img:border prose-img:border-border"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16 border-t border-border pt-12">
                <h2 className="mb-8 text-2xl font-bold text-foreground">
                  Related Posts
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((relatedPost) => (
                    <div key={relatedPost.id} className="flex">
                      <BlogCard
                        id={relatedPost.id}
                        title={relatedPost.title}
                        excerpt={relatedPost.excerpt}
                        image={relatedPost.image || "/placeholder-blog.jpg"}
                        date={formatDate(relatedPost.publishedAt)}
                        slug={relatedPost.slug}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

