"use client";

import { useState, useMemo, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlogTable } from "./blog-table";
import { BlogFilters } from "./blog-filters";
import { BlogTableSkeleton } from "./blog-table-skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BlogPost {
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

interface BlogClientProps {
  initialPosts: BlogPost[];
  initialFilter: string;
}

function BlogContent({ initialPosts, initialFilter }: BlogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPublished, setFilterPublished] = useState(initialFilter);
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (status: string) => {
    setFilterPublished(status);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (status === "all") {
        params.delete("published");
      } else {
        params.set("published", status);
      }
      router.replace(`/admin/blog?${params.toString()}`);
    });
  };

  const handleRefresh = async () => {
    startTransition(async () => {
      try {
        const params = new URLSearchParams();
        if (filterPublished !== "all") {
          params.append("published", filterPublished);
        }
        const response = await fetch(`/api/admin/blog?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    });
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.slug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [posts, searchQuery]);

  return (
    <>
      <BlogFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterPublished={filterPublished}
        onFilterChange={handleFilterChange}
      />

      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-12">
          <p className="text-muted-foreground">
            {searchQuery ? "No posts match your search" : "No blog posts found"}
          </p>
          {!searchQuery && (
            <Button asChild className="mt-4" variant="outline">
              <Link href="/admin/blog/new">Create your first post</Link>
            </Button>
          )}
        </div>
      ) : (
        <BlogTable posts={filteredPosts} onTogglePublish={handleRefresh} />
      )}
    </>
  );
}

export function BlogClient(props: BlogClientProps) {
  return (
    <Suspense fallback={<BlogTableSkeleton />}>
      <BlogContent {...props} />
    </Suspense>
  );
}

