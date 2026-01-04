"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Edit, Trash2, Calendar, CheckCircle2, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

interface BlogTableProps {
  posts: BlogPost[];
  onTogglePublish?: () => void;
}

export function BlogTable({ posts, onTogglePublish }: BlogTableProps) {
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  const handleTogglePublish = async (post: BlogPost) => {
    const newPublished = !post.published;
    // Optimistic update
    setOptimisticUpdates((prev) => ({ ...prev, [post.id]: newPublished }));

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/blog/${post.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            published: newPublished,
          }),
        });

        if (response.ok) {
          toast.success(
            newPublished
              ? "Post published successfully"
              : "Post unpublished successfully"
          );
          setOptimisticUpdates((prev) => {
            const next = { ...prev };
            delete next[post.id];
            return next;
          });
          onTogglePublish?.();
        } else {
          const error = await response.json();
          // Revert optimistic update
          setOptimisticUpdates((prev) => {
            const next = { ...prev };
            delete next[post.id];
            return next;
          });
          toast.error(error.error || "Failed to update post");
        }
      } catch (error) {
        console.error("Error updating post:", error);
        // Revert optimistic update
        setOptimisticUpdates((prev) => {
          const next = { ...prev };
          delete next[post.id];
          return next;
        });
        toast.error("Failed to update post");
      }
    });
  };

  const handleDelete = async (id: string, title: string) => {
    toast.promise(
      async () => {
        const response = await fetch(`/api/admin/blog/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to delete post");
        }

        onTogglePublish?.();
      },
      {
        loading: `Deleting "${title}"...`,
        success: "Post deleted successfully",
        error: (err) => err.message || "Failed to delete post",
      }
    );
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Not published";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPostPublished = (post: BlogPost) => {
    return optimisticUpdates[post.id] !== undefined
      ? optimisticUpdates[post.id]
      : post.published;
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Title</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="hidden md:table-cell min-w-[120px]">Published</TableHead>
              <TableHead className="hidden lg:table-cell min-w-[120px]">Updated</TableHead>
              <TableHead className="text-right min-w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          {posts.map((post) => {
            const published = getPostPublished(post);
            const isUpdating = optimisticUpdates[post.id] !== undefined;

            return (
              <TableRow key={post.id} className={isUpdating ? "opacity-60" : ""}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">
                      {post.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      /{post.slug}
                    </div>
                  </div>
                </TableCell>
                  <TableCell>
                    <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      published
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {published ? "Published" : "Draft"}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="size-4" />
                    {formatDate(post.publishedAt)}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                  {formatDate(post.updatedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {published ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePublish(post)}
                        disabled={isPending}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950"
                      >
                        <Ban className="mr-1.5 size-4" />
                        Unpublish
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePublish(post)}
                        disabled={isPending}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                      >
                        <CheckCircle2 className="mr-1.5 size-4" />
                        Publish
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <Edit className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={isPending}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        </Table>
      </div>
    </div>
  );
}

