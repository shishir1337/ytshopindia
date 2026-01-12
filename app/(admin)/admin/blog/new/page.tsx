"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageUpload } from "@/components/admin/image-upload";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    published: true, // Always publish immediately
  });
  const [slugLocked, setSlugLocked] = useState(true);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const generateExcerpt = (htmlContent: string, maxLength: number = 150) => {
    // Strip HTML tags
    const text = htmlContent
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();

    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: slugLocked ? generateSlug(title) : prev.slug,
    }));
  };

  const handleContentChange = (content: string) => {
    const excerpt = generateExcerpt(content);
    setFormData((prev) => ({
      ...prev,
      content,
      excerpt,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Blog post created successfully!");
        router.push(`/admin/blog/${data.post.id}/edit`);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">New Blog Post</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a new blog post
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <div className="mt-1 flex gap-2">
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        slug: generateSlug(e.target.value),
                      }))
                    }
                    placeholder="post-url-slug"
                    required
                    disabled={slugLocked}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setSlugLocked(!slugLocked)}
                    title={slugLocked ? "Unlock to edit slug" : "Lock slug"}
                  >
                    {slugLocked ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 5.5-5 4.8 4.8 0 0 1 4.5 5v4" />
                      </svg>
                    )}
                  </Button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {slugLocked
                    ? "Auto-generated from title. Click lock to edit manually."
                    : "Slug is unlocked. Click lock to auto-generate from title."}
                </p>
              </div>

              <div>
                <Label>Content *</Label>
                <div className="mt-1">
                  <RichTextEditor
                    content={formData.content}
                    onChange={handleContentChange}
                    placeholder="Write your blog post content here..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <ImageUpload
                label="Featured Image"
                value={formData.image}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                uploadType="blog"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={loading} className="w-full">
                <Save className="mr-2 size-4" />
                {loading ? "Creating..." : "Create Post"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

