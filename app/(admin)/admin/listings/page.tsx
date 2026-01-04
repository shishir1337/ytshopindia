import { ListingsClient } from "./components/listings-client";
import { getListings } from "./lib/get-listings";

interface ListingsPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;
  const status = params.status || "all";
  const listings = await getListings(status);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Channel Listings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage YouTube channel listings
          </p>
        </div>
      </div>

      <ListingsClient initialListings={listings} initialStatus={status} />
    </div>
  );
}
