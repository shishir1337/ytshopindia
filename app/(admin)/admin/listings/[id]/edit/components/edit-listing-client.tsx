"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, CheckCircle2, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/image-upload";
import { MultipleImageUpload } from "@/components/admin/multiple-image-upload";
import { Badge } from "@/components/ui/badge";

interface ListingData {
  id: string;
  title: string;
  description: string | null;
  channelLink: string | null;
  sellerName: string;
  sellerEmail: string;
  sellerWhatsapp: string | null;
  expectedPrice: string | null;
  currency: string;
  featuredImage: string | null;
  images: string[];
  startDate: Date | null;
  category: string | null;
  revenueSources: string | null;
  monthlyRevenue: string | null;
  status: string;
  listingId: string | null;
  subscribers: string | null;
  creationDate: Date | null;
  language: string | null;
  videoCount: string | null;
  channelType: string | null;
  contentType: string | null;
  viewsLast28Days: string | null;
  lifetimeViews: string | null;
  copyrightStrike: string | null;
  communityStrike: string | null;
  monetized: boolean | null;
  shortsViews90Days: string | null;
  revenueLast28Days: string | null;
  lifetimeRevenue: string | null;
  notes: string | null;
}

interface EditListingClientProps {
  listing: ListingData;
}

// Helper function to extract monetization status from description
function extractMonetizationStatus(description: string | null): string {
  if (!description) return "";
  const match = description.match(/Monetization Status:\s*([^\n]+)/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return "";
}

// Helper function to remove monetization status from description
function removeMonetizationStatusFromDescription(description: string | null): string {
  if (!description) return "";
  return description
    .replace(/Monetization Status:\s*[^\n]+/gi, "")
    .replace(/\n\n+/g, "\n")
    .trim();
}

export function EditListingClient({ listing: initialListing }: EditListingClientProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [fetchingYoutube, setFetchingYoutube] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Extract monetization status from description
  const extractedMonetizationStatus = extractMonetizationStatus(initialListing.description);
  const cleanDescription = removeMonetizationStatusFromDescription(initialListing.description);
  
  const [formData, setFormData] = useState({
    title: initialListing.title || "",
    description: cleanDescription,
    channelLink: initialListing.channelLink || "",
    sellerName: initialListing.sellerName || "",
    sellerEmail: initialListing.sellerEmail || "",
    sellerWhatsapp: initialListing.sellerWhatsapp || "",
    expectedPrice: initialListing.expectedPrice || "",
    currency: initialListing.currency || "₹",
    featuredImage: initialListing.featuredImage || "",
    images: initialListing.images || [],
    startDate: initialListing.startDate
      ? new Date(initialListing.startDate).toISOString().split("T")[0]
      : "",
    category: initialListing.category || "",
    revenueSources: initialListing.revenueSources || "",
    monthlyRevenue: initialListing.monthlyRevenue || "",
    status: initialListing.status || "pending",
    listingId: initialListing.listingId || "",
    subscribers: initialListing.subscribers || "",
    creationDate: initialListing.creationDate
      ? new Date(initialListing.creationDate).toISOString().split("T")[0]
      : "",
    language: initialListing.language || "",
    videoCount: initialListing.videoCount || "",
    channelType: initialListing.channelType || "",
    contentType: initialListing.contentType || "",
    viewsLast28Days: initialListing.viewsLast28Days || "",
    lifetimeViews: initialListing.lifetimeViews || "",
    copyrightStrike: initialListing.copyrightStrike || "None",
    communityStrike: initialListing.communityStrike || "None",
    monetized: initialListing.monetized ?? false,
    monetizationStatus: extractedMonetizationStatus || "",
    shortsViews90Days: initialListing.shortsViews90Days || "",
    revenueLast28Days: initialListing.revenueLast28Days || "",
    lifetimeRevenue: initialListing.lifetimeRevenue || "",
    notes: initialListing.notes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Combine description with monetization status
      let finalDescription = formData.description || "";
      if (formData.monetizationStatus) {
        finalDescription = finalDescription
          ? `${finalDescription}\n\nMonetization Status: ${formData.monetizationStatus}`
          : `Monetization Status: ${formData.monetizationStatus}`;
      }
      
      // Set monetized boolean based on monetization status
      const monetized = formData.monetizationStatus.toLowerCase() === "monetized";
      
      // Exclude monetizationStatus from submitData (it's only for UI)
      const { monetizationStatus, ...restFormData } = formData;
      
      const submitData = {
        ...restFormData,
        description: finalDescription,
        monetized,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        creationDate: formData.creationDate ? new Date(formData.creationDate).toISOString() : null,
      };

      const response = await fetch(`/api/admin/listings/${initialListing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast.success("Listing updated successfully!");
        router.push("/admin/listings");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update listing");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update listing");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    toast.promise(
      async () => {
        const response = await fetch(`/api/admin/listings/${initialListing.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to delete listing");
        }

        router.push("/admin/listings");
      },
      {
        loading: "Deleting listing...",
        success: "Listing deleted successfully",
        error: (err) => err.message || "Failed to delete listing",
      }
    );
  };

  const handleFetchFromYouTube = async () => {
    if (!formData.channelLink) {
      toast.error("Please enter a channel link first");
      return;
    }

    setFetchingYoutube(true);
    try {
      const response = await fetch(
        `/api/admin/listings/${initialListing.id}/fetch-youtube?channelUrl=${encodeURIComponent(
          formData.channelLink
        )}`
      );

      if (response.ok) {
        const data = await response.json();
        const youtubeData = data.data;

        setFormData((prev) => ({
          ...prev,
          subscribers: youtubeData.subscribers || prev.subscribers,
          creationDate: youtubeData.creationDate || prev.creationDate,
          lifetimeViews: youtubeData.lifetimeViews || prev.lifetimeViews,
          language: youtubeData.language || prev.language,
          videoCount: youtubeData.videoCount || prev.videoCount,
          featuredImage: youtubeData.featuredImage || prev.featuredImage,
        }));

        toast.success("Channel data fetched successfully!", {
          description: `Fetched data for: ${data.channelInfo.title}`,
        });
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to fetch YouTube data");
      }
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
      toast.error("Failed to fetch YouTube data");
    } finally {
      setFetchingYoutube(false);
    }
  };

  const handleApprove = async () => {
    toast.promise(
      async () => {
        const response = await fetch(`/api/admin/listings/${initialListing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "approved" }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to approve listing");
        }

        router.refresh();
        setFormData((prev) => ({ ...prev, status: "approved" }));
      },
      {
        loading: "Approving listing...",
        success: "Listing approved successfully! It will be published on the frontend.",
        error: (err) => err.message || "Failed to approve listing",
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/listings">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Listing</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {initialListing.listingId && (
                <Badge variant="outline" className="mr-2">
                  {initialListing.listingId}
                </Badge>
              )}
              Update listing details
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {formData.status === "pending" && (
            <Button onClick={handleApprove} disabled={saving || isPending}>
              <CheckCircle2 className="mr-2 size-4" />
              Approve Listing
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={saving || isPending}
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div>
        <Badge
          variant={
            formData.status === "approved"
              ? "default"
              : formData.status === "pending"
              ? "secondary"
              : "destructive"
          }
          className={formData.status === "approved" ? "bg-green-600" : ""}
        >
          Status: {formData.status.toUpperCase()}
        </Badge>
        {formData.listingId && (
          <span className="ml-4 text-sm text-muted-foreground">
            Listing ID: {formData.listingId}
          </span>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Basic Information
              </h2>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <Label htmlFor="channelLink">Channel Link</Label>
                <div className="mt-1 flex gap-2">
                  <Input
                    id="channelLink"
                    type="url"
                    value={formData.channelLink}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        channelLink: e.target.value,
                      }))
                    }
                    placeholder="https://www.youtube.com/@channelname"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFetchFromYouTube}
                    disabled={fetchingYoutube || !formData.channelLink}
                    title="Fetch channel data from YouTube"
                  >
                    {fetchingYoutube ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 size-4" />
                        Fetch from YouTube
                      </>
                    )}
                  </Button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Click "Fetch from YouTube" to auto-fill: Subscribers, Creation Date, Lifetime Views, Language, Video Count, and Featured Image
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={formData.language}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Summary/Details */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Channel Summary
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="subscribers">Subscribers</Label>
                  <Input
                    id="subscribers"
                    value={formData.subscribers}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subscribers: e.target.value,
                      }))
                    }
                    placeholder="e.g., 1,600+"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="creationDate">Creation Date</Label>
                  <Input
                    id="creationDate"
                    type="date"
                    value={formData.creationDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        creationDate: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="videoCount">Video Count</Label>
                  <Input
                    id="videoCount"
                    value={formData.videoCount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        videoCount: e.target.value,
                      }))
                    }
                    placeholder="e.g., 625"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="channelType">Channel Type</Label>
                  <Input
                    id="channelType"
                    value={formData.channelType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        channelType: e.target.value,
                      }))
                    }
                    placeholder="e.g., Short Videos"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <Input
                    id="contentType"
                    value={formData.contentType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contentType: e.target.value,
                      }))
                    }
                    placeholder="e.g., New"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="viewsLast28Days">Views (Last 28 Days)</Label>
                  <Input
                    id="viewsLast28Days"
                    value={formData.viewsLast28Days}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        viewsLast28Days: e.target.value,
                      }))
                    }
                    placeholder="e.g., 31+"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="lifetimeViews">Lifetime Views</Label>
                  <Input
                    id="lifetimeViews"
                    value={formData.lifetimeViews}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lifetimeViews: e.target.value,
                      }))
                    }
                    placeholder="e.g., 215K+"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="copyrightStrike">Copyright Strike</Label>
                  <Input
                    id="copyrightStrike"
                    value={formData.copyrightStrike}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        copyrightStrike: e.target.value,
                      }))
                    }
                    placeholder="e.g., None"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="communityStrike">Community Strike</Label>
                  <Input
                    id="communityStrike"
                    value={formData.communityStrike}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        communityStrike: e.target.value,
                      }))
                    }
                    placeholder="e.g., None"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="shortsViews90Days">
                    Shorts Views (Last 90 Days)
                  </Label>
                  <Input
                    id="shortsViews90Days"
                    value={formData.shortsViews90Days}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        shortsViews90Days: e.target.value,
                      }))
                    }
                    placeholder="e.g., 26+"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="revenueLast28Days">
                    Revenue (Last 28 Days)
                  </Label>
                  <Input
                    id="revenueLast28Days"
                    value={formData.revenueLast28Days}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        revenueLast28Days: e.target.value,
                      }))
                    }
                    placeholder="e.g., Nil"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="lifetimeRevenue">Lifetime Revenue</Label>
                  <Input
                    id="lifetimeRevenue"
                    value={formData.lifetimeRevenue}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lifetimeRevenue: e.target.value,
                      }))
                    }
                    placeholder="e.g., Nil"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="monetizationStatus">
                  Monetization Status
                </Label>
                <Select
                  value={formData.monetizationStatus}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      monetizationStatus: value,
                      monetized: value.toLowerCase() === "monetized",
                    }))
                  }
                >
                  <SelectTrigger id="monetizationStatus" className="mt-1">
                    <SelectValue placeholder="Select monetization status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monetized">Monetized</SelectItem>
                    <SelectItem value="Non-Monetized">Non-Monetized</SelectItem>
                    <SelectItem value="Demonetized">Demonetized</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Revenue Information */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Revenue Information
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="revenueSources">Revenue Sources</Label>
                  <Input
                    id="revenueSources"
                    value={formData.revenueSources}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        revenueSources: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="monthlyRevenue">Monthly Revenue</Label>
                  <Input
                    id="monthlyRevenue"
                    value={formData.monthlyRevenue}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        monthlyRevenue: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Actions */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Status & Actions
              </h2>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expectedPrice">Expected Price</Label>
                <div className="mt-1 flex gap-2">
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, currency: value }))
                    }
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="₹">₹ (INR)</SelectItem>
                      <SelectItem value="$">$ (USD)</SelectItem>
                      <SelectItem value="€">€ (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="expectedPrice"
                    value={formData.expectedPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        expectedPrice: e.target.value,
                      }))
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Images</h2>
              <ImageUpload
                value={formData.featuredImage}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, featuredImage: url }))
                }
                label="Featured Image"
              />
              <div className="pt-4 border-t border-border">
                <MultipleImageUpload
                  value={formData.images}
                  onChange={(urls) =>
                    setFormData((prev) => ({ ...prev, images: urls }))
                  }
                  label="Additional Images"
                  maxImages={10}
                />
              </div>
            </div>

            {/* Seller Information */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Seller Information
              </h2>

              <div>
                <Label htmlFor="sellerName">Name</Label>
                <Input
                  id="sellerName"
                  value={formData.sellerName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sellerName: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="sellerEmail">Email</Label>
                <Input
                  id="sellerEmail"
                  type="email"
                  value={formData.sellerEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sellerEmail: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="sellerWhatsapp">WhatsApp</Label>
                <Input
                  id="sellerWhatsapp"
                  value={formData.sellerWhatsapp}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sellerWhatsapp: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
            </div>

            {/* Admin Notes */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Admin Notes
              </h2>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows={4}
                placeholder="Internal notes about this listing..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={saving || isPending} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 size-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full"
                disabled={saving || isPending}
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
