"use client";

import { useState, useMemo, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ListingsTable } from "./listings-table";
import { ListingsFilters } from "./listings-filters";
import { ListingsTableSkeleton } from "./listings-table-skeleton";

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

interface ListingsClientProps {
  initialListings: Listing[];
  initialStatus: string;
}

function ListingsContent({
  initialListings,
  initialStatus,
}: ListingsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    // Use router.replace for instant navigation without scroll to top
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (status === "all") {
        params.delete("status");
      } else {
        params.set("status", status);
      }
      router.replace(`/admin/listings?${params.toString()}`);
    });
  };

  const handleRefresh = async () => {
    startTransition(async () => {
      try {
        const params = new URLSearchParams();
        if (filterStatus !== "all") {
          params.append("status", filterStatus);
        }
        const response = await fetch(`/api/admin/listings?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setListings(data.listings || []);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    });
  };

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesSearch =
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.sellerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (listing.listingId &&
          listing.listingId.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [listings, searchQuery]);

  return (
    <>
      <ListingsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={handleFilterChange}
      />

      {filteredListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-12">
          <p className="text-muted-foreground">
            {searchQuery ? "No listings match your search" : "No listings found"}
          </p>
        </div>
      ) : (
        <ListingsTable listings={filteredListings} onStatusChange={handleRefresh} />
      )}
    </>
  );
}

export function ListingsClient(props: ListingsClientProps) {
  return (
    <Suspense fallback={<ListingsTableSkeleton />}>
      <ListingsContent {...props} />
    </Suspense>
  );
}
