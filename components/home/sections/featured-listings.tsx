import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChannelCard } from "@/components/home/cards/channel-card"
import { ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getFeaturedListings() {
  try {
    const listings = await prisma.channelListing.findMany({
      where: {
        status: "approved",
      },
      select: {
        id: true,
        title: true,
        description: true,
        featuredImage: true,
        subscribers: true,
        monetized: true,
        expectedPrice: true,
        currency: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    })
    return listings
  } catch (error) {
    console.error("Error fetching featured listings:", error)
    return []
  }
}

export async function FeaturedListings() {
  const listings = await getFeaturedListings()

  // Don't render section if no listings
  if (listings.length === 0) {
    return null
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Featured Listings
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Discover premium YouTube channels ready for acquisition. Handpicked listings with verified metrics and growth potential.
          </p>
        </div>

        {/* Channel Cards Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* View All Button */}
        <div className="flex justify-center">
          <Button asChild size="lg" variant="outline" className="group">
            <Link href="/buy-channel">
              View All Channels
              <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
