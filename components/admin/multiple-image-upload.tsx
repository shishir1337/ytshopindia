"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface MultipleImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  maxImages?: number;
  uploadType?: "blog" | "testimonials" | "listings" | "misc";
}

export function MultipleImageUpload({
  value,
  onChange,
  label = "Images",
  maxImages = 10,
  uploadType = "misc",
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed max
    if (value.length + files.length > maxImages) {
      toast.error("Too many images", {
        description: `Maximum ${maxImages} images allowed. You can add ${maxImages - value.length} more.`,
      });
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      // Upload files sequentially
      for (const file of files) {
        // Validate file type
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "image/gif",
        ];
        if (!allowedTypes.includes(file.type)) {
          toast.error(`Invalid file type: ${file.name}`, {
            description: "Please upload an image (JPEG, PNG, WebP, or GIF).",
          });
          continue;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          toast.error(`File too large: ${file.name}`, {
            description: "File size exceeds 5MB limit.",
          });
          continue;
        }

        // Upload file
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`/api/admin/upload?type=${uploadType}`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        } else {
          const error = await response.json();
          toast.error(`Failed to upload ${file.name}`, {
            description: error.error || "Upload failed",
          });
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...value, ...uploadedUrls]);
        toast.success(`Uploaded ${uploadedUrls.length} image(s) successfully`);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
    toast.success("Image removed");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-xs text-muted-foreground">
          {value.length}/{maxImages} images
        </span>
      </div>

      {/* Upload Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || value.length >= maxImages}
        className="w-full"
      >
        <Upload className="mr-2 size-4" />
        {uploading
          ? "Uploading..."
          : value.length >= maxImages
            ? `Maximum ${maxImages} images`
            : "Upload Images"}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Images Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square w-full overflow-hidden rounded-md border border-border bg-muted">
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    console.error("Image failed to load:", url);
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(index)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length === 0 && (
        <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-border bg-muted/30">
          <div className="text-center">
            <ImageIcon className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-2 text-xs text-muted-foreground">
              No additional images
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

