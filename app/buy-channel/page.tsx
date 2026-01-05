import { Suspense } from "react"
import { Metadata } from "next"
import { ChannelListings } from "./components/channel-listings"
import { ChannelFilters } from "./components/channel-filters"
import { Youtube, ShoppingBag } from "lucide-react"

export const metadata: Metadata = {
    title: "Buy YouTube Channels | YT SHOP INDIA",
    description: "Browse and buy verified YouTube channels. Filter by subscribers, monetization status, and more. Find your perfect channel on YT SHOP INDIA.",
}

export default function BuyChannelPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    return (
        <main className="min-h-screen bg-background">
            {/* Page Header */}
            <section className="relative py-12 sm:py-16 lg:py-20 bg-muted overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                            <ShoppingBag className="size-4" />
                            <span>Browse Our Marketplace</span>
                        </div>
                        <h1 className="mb-6 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
                            Buy <span className="text-primary">YouTube Channels</span>
                        </h1>
                        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg max-w-3xl mx-auto">
                            Explore our curated collection of verified YouTube channels. Use filters to find the perfect channel
                            that matches your requirements and budget.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters and Listings */}
            <section className="py-8 sm:py-12 lg:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filters */}
                    <Suspense fallback={<div className="h-16 bg-muted animate-pulse rounded-lg mb-8" />}>
                        <ChannelFilters />
                    </Suspense>

                    {/* Listings Grid */}
                    <Suspense fallback={<ListingsSkeleton />}>
                        <ChannelListings searchParams={searchParams} />
                    </Suspense>
                </div>
            </section>
        </main>
    )
}

function ListingsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="aspect-video bg-muted animate-pulse" />
                    <div className="p-5 space-y-4">
                        <div className="h-6 bg-muted animate-pulse rounded" />
                        <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                        <div className="h-10 bg-muted animate-pulse rounded" />
                    </div>
                </div>
            ))}
        </div>
    )
}
