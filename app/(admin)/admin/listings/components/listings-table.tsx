"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Listing {
  id: string;
  title: string;
  listingId: string | null;
  status: string;
  sellerName: string;
  sellerEmail: string;
  category: string | null;
  subscribers: string | null;
  expectedPrice: string | null;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  approvedAt: Date | null;
}

interface ListingsTableProps {
  listings: Listing[];
  onStatusChange?: () => void;
}

export function ListingsTable({ listings, onStatusChange }: ListingsTableProps) {
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic update
    const previousStatus = listings.find((l) => l.id === id)?.status;
    setOptimisticUpdates((prev) => ({ ...prev, [id]: newStatus }));

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/listings/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
          toast.success("Listing status updated successfully");
          setOptimisticUpdates((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
          onStatusChange?.();
        } else {
          const error = await response.json();
          // Revert optimistic update
          setOptimisticUpdates((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
          toast.error(error.error || "Failed to update listing");
        }
      } catch (error) {
        console.error("Error updating listing:", error);
        // Revert optimistic update
        setOptimisticUpdates((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        toast.error("Failed to update listing");
      }
    });
  };

  const handleDelete = async (id: string, title: string) => {
    toast.promise(
      async () => {
        const response = await fetch(`/api/admin/listings/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to delete listing");
        }

        onStatusChange?.();
      },
      {
        loading: `Deleting "${title}"...`,
        success: "Listing deleted successfully",
        error: (err) => err.message || "Failed to delete listing",
      }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle2 className="mr-1 size-3" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 size-3" />
            Pending
          </Badge>
        );
      case "sold":
        return (
          <Badge variant="default" className="bg-blue-600">
            Sold
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 size-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getListingStatus = (listing: Listing) => {
    return optimisticUpdates[listing.id] ?? listing.status;
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Title</TableHead>
              <TableHead className="hidden md:table-cell min-w-[120px]">Listing ID</TableHead>
              <TableHead className="min-w-[150px]">Seller</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="hidden lg:table-cell min-w-[100px]">Category</TableHead>
              <TableHead className="hidden md:table-cell min-w-[100px]">Price</TableHead>
              <TableHead className="hidden lg:table-cell min-w-[120px]">Created</TableHead>
              <TableHead className="text-right min-w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          {listings.map((listing) => {
            const currentStatus = getListingStatus(listing);
            const isUpdating = optimisticUpdates[listing.id] !== undefined;

            return (
              <TableRow key={listing.id} className={isUpdating ? "opacity-60" : ""}>
                  <TableCell>
                    <div className="font-medium text-foreground">
                      {listing.title}
                    </div>
                    <div className="text-xs text-muted-foreground md:hidden mt-1">
                      {listing.listingId || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm text-muted-foreground">
                      {listing.listingId || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-foreground">
                        {listing.sellerName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {listing.sellerEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(currentStatus)}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="text-sm text-muted-foreground">
                      {listing.category || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm font-medium text-foreground">
                      {listing.expectedPrice
                        ? `${listing.currency} ${listing.expectedPrice}`
                        : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {formatDate(listing.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {currentStatus === "pending" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(listing.id, "approved")}
                        disabled={isPending}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                      >
                        <CheckCircle2 className="mr-1.5 size-4" />
                        Approve
                      </Button>
                    ) : currentStatus === "approved" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(listing.id, "pending")}
                        disabled={isPending}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950"
                      >
                        <Ban className="mr-1.5 size-4" />
                        Unapprove
                      </Button>
                    ) : null}
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/listings/${listing.id}/edit`}>
                        <Edit className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(listing.id, listing.title)}
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

