import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getListingById } from "./lib/get-listing";
import { EditListingClient } from "./components/edit-listing-client";
import { EditListingSkeleton } from "./components/edit-listing-skeleton";

interface EditListingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  return (
    <Suspense fallback={<EditListingSkeleton />}>
      <EditListingClient listing={listing} />
    </Suspense>
  );
}
