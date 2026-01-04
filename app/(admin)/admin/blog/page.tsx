import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogClient } from "./components/blog-client";
import { getBlogPosts } from "./lib/get-blog-posts";

interface BlogPageProps {
  searchParams: Promise<{
    published?: string;
  }>;
}

export default async function BlogPostsPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const published = params.published || "all";
  const posts = await getBlogPosts(published);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Blog Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your blog posts and content
          </p>
        </div>
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href="/admin/blog/new">
            <Plus className="mr-2 size-4" />
            New Post
          </Link>
        </Button>
      </div>

      <BlogClient initialPosts={posts} initialFilter={published} />
    </div>
  );
}
