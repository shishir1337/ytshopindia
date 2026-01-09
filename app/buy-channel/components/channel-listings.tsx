import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ChannelCard } from "@/components/home/cards/channel-card"
import { Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChannelListingsProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Parse subscriber string to number for filtering
function parseSubscriberCount(subs: string | null | undefined): number {
    if (!subs) return 0
    const cleaned = subs.replace(/[^0-9.]/g, "")
    const num = parseFloat(cleaned)
    if (subs.toLowerCase().includes("m")) {
        return num * 1000000
    }
    if (subs.toLowerCase().includes("k")) {
        return num * 1000
    }
    return isNaN(num) ? 0 : num
}

// Get subscriber range based on filter value
function getSubscriberRange(filter: string): { min: number; max: number } | null {
    switch (filter) {
        case "below-5k":
            return { min: 0, max: 5000 }
        case "5k-20k":
            return { min: 5000, max: 20000 }
        case "20k-50k":
            return { min: 20000, max: 50000 }
        case "50k-100k":
            return { min: 50000, max: 100000 }
        case "100k-500k":
            return { min: 100000, max: 500000 }
        case "500k-1m":
            return { min: 500000, max: 1000000 }
        case "above-1m":
            return { min: 1000000, max: Infinity }
        default:
            return null
    }
}

async function getListings(params: { [key: string]: string | string[] | undefined }) {
    try {
        const subscriberFilter = typeof params.subscribers === "string" ? params.subscribers : "all"
        const monetizationFilter = typeof params.monetization === "string" ? params.monetization : "all"
        const searchQuery = typeof params.search === "string" ? params.search.trim().toLowerCase() : ""

        // Build where clause
        const where: Record<string, unknown> = {
            status: "approved",
        }

        // Monetization filter
        if (monetizationFilter === "monetized") {
            where.monetized = true
        } else if (monetizationFilter === "not-monetized") {
            where.monetized = false
        }

        // Search filter - filter by channel name (title)
        if (searchQuery) {
            where.title = {
                contains: searchQuery,
                mode: "insensitive",
            }
        }

        // Fetch listings
        let listings = await prisma.channelListing.findMany({
            where,
            select: {
                id: true,
                title: true,
                description: true,
                featuredImage: true,
                subscribers: true,
                monetized: true,
                category: true,
                viewsLast28Days: true,
                expectedPrice: true,
                currency: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        })

        // Filter by subscribers (done in memory since subscribers is stored as string)
        const subscriberRange = getSubscriberRange(subscriberFilter)
        if (subscriberRange) {
            listings = listings.filter((listing) => {
                const count = parseSubscriberCount(listing.subscribers)
                return count >= subscriberRange.min && count < subscriberRange.max
            })
        }

        return listings
    } catch (error) {
        console.error("Error fetching listings:", error)
        return []
    }
}

export async function ChannelListings({ searchParams }: ChannelListingsProps) {
    const params = await searchParams
    const listings = await getListings(params)

    if (listings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
                <div className="flex size-20 items-center justify-center rounded-full bg-muted mb-6">
                    <Youtube className="size-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Channels Found</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                    No channels match your current filters. Try adjusting your filters or check back later for new listings.
                </p>
                <Button asChild variant="outline">
                    <Link href="/buy-channel">Clear Filters</Link>
                </Button>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{listings.length}</span> channel{listings.length !== 1 ? "s" : ""}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((listing) => (
                    <ChannelCard
                        key={listing.id}
                        id={listing.id}
                        channelImage={listing.featuredImage}
                        title={listing.title}
                        subscribers={listing.subscribers}
                        monetized={listing.monetized}
                        description={listing.description}
                        category={listing.category}
                        expectedPrice={listing.expectedPrice}
                        currency={listing.currency}
                    />
                ))}
            </div>
        </div>
    )
}
