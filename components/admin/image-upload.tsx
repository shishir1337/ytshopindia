"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Featured Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview with value prop
  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

          // Validate file type
          const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
          if (!allowedTypes.includes(file.type)) {
            toast.error("Invalid file type", {
              description: "Please upload an image (JPEG, PNG, WebP, or GIF).",
            });
            return;
          }

          // Validate file size (max 5MB)
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (file.size > maxSize) {
            toast.error("File too large", {
              description: "File size exceeds 5MB limit. Please choose a smaller image.",
            });
            return;
          }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
              onChange(data.url);
              setPreview(data.url);
              toast.success("Image uploaded successfully");
            } else {
              const error = await response.json();
              toast.error(error.error || "Failed to upload image");
              setPreview(null);
            }
          } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
            setPreview(null);
          } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {/* Upload Button */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          <Upload className="mr-2 size-4" />
          {uploading ? "Uploading..." : "Upload Image"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Preview */}
      {preview && (
        <div className="relative mt-2">
          <div className="relative h-48 w-full overflow-hidden rounded-md border border-border">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={() => setPreview(null)}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={handleRemove}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {!preview && (
        <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-border bg-muted/30">
          <div className="text-center">
            <ImageIcon className="mx-auto size-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              No image selected
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

