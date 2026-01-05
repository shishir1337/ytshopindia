import { CreateListingClient } from "./components/create-listing-client";

export default async function NewListingPage() {
    return (
        <div className="space-y-6">
            <CreateListingClient />
        </div>
    );
}
