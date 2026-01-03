import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChannelCard } from "@/components/home/cards/channel-card"
import { ArrowRight } from "lucide-react"

// Dummy data - will be replaced with real data from admin panel later
// Note: Price is not displayed as it's handled via WhatsApp after form submission
const featuredChannels = [
  {
    id: "1",
    channelImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop",
    title: "Tech Reviews & Unboxing",
    subscribers: 125000,
    monetized: "Monetized" as const,
    description: "Popular tech channel with consistent uploads, high engagement rate, and active community. Perfect for tech enthusiasts.",
  },
  {
    id: "2",
    channelImage: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&h=450&fit=crop",
    title: "Gaming Adventures",
    subscribers: 85000,
    monetized: "Monetized" as const,
    description: "Gaming content channel with regular live streams and gameplay videos. Strong viewer retention and subscriber growth.",
  },
  {
    id: "3",
    channelImage: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop",
    title: "Cooking & Recipes",
    subscribers: 45000,
    monetized: "Non-Monetized" as const,
    description: "Food and cooking channel with authentic recipes and cooking tutorials. Growing audience with high engagement.",
  },
  {
    id: "4",
    channelImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
    title: "Fitness & Wellness",
    subscribers: 32000,
    monetized: "Monetized" as const,
    description: "Health and fitness channel with workout routines and wellness tips. Active community and consistent content.",
  },
  {
    id: "5",
    channelImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    title: "Business & Finance",
    subscribers: 68000,
    monetized: "Monetized" as const,
    description: "Educational channel about business strategies and financial advice. Professional content with high-quality production.",
  },
  {
    id: "6",
    channelImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=450&fit=crop",
    title: "Travel & Vlogs",
    subscribers: 95000,
    monetized: "Non-Monetized" as const,
    description: "Travel vlogging channel showcasing beautiful destinations and cultural experiences. Engaging storytelling and visuals.",
  },
]

export function FeaturedListings() {
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
          {featuredChannels.map((channel) => (
            <ChannelCard key={channel.id} {...channel} />
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

