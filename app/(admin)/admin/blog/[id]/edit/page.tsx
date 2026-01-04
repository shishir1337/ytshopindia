"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { Lock, Unlock } from "lucide-react";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugLocked, setSlugLocked] = useState(true);
  const [originalSlug, setOriginalSlug] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    published: false,
  });

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.post.title,
          slug: data.post.slug,
          excerpt: data.post.excerpt,
          content: data.post.content,
          image: data.post.image || "",
          published: data.post.published,
        });
              setOriginalSlug(data.post.slug);
            } else {
              toast.error("Failed to load post");
              router.push("/admin/blog");
            }
          } catch (error) {
            console.error("Error fetching post:", error);
            toast.error("Failed to load post");
          } finally {
      setLoading(false);
    }
  };

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
      // Don't auto-update slug in edit mode when locked - keep original
      slug: slugLocked ? originalSlug : prev.slug,
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
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

            if (response.ok) {
              toast.success("Post updated successfully!");
              router.push("/admin/blog");
            } else {
              const error = await response.json();
              toast.error(error.error || "Failed to update post");
            }
          } catch (error) {
            console.error("Error updating post:", error);
            toast.error("Failed to update post");
          } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    toast.promise(
      async () => {
        const response = await fetch(`/api/admin/blog/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to delete post");
        }

        router.push("/admin/blog");
      },
      {
        loading: "Deleting post...",
        success: "Post deleted successfully",
        error: (err) => err.message || "Failed to delete post",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-foreground">Edit Blog Post</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your blog post
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={saving}
        >
          <Trash2 className="mr-2 size-4" />
          Delete
        </Button>
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
                      <Lock className="size-4" />
                    ) : (
                      <Unlock className="size-4" />
                    )}
                  </Button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {slugLocked
                    ? "Slug is locked. Click unlock to edit manually."
                    : "Slug is unlocked. Click lock to prevent accidental changes."}
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
            {/* Publish Settings */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Publish Settings
              </h2>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      published: checked === true,
                    }))
                  }
                />
                <Label
                  htmlFor="published"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Published
                </Label>
              </div>

              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={saving} className="w-full">
                <Save className="mr-2 size-4" />
                {saving ? "Saving..." : "Save Changes"}
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

