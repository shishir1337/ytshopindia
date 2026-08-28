import { Hero } from "@/components/home/sections/hero"
import { FeaturedListings } from "@/components/home/sections/featured-listings"
import { WhyYtShop } from "@/components/home/sections/why-ytshop"
import { AnalyticsVideos } from "@/components/home/sections/analytics-videos"
import { CreatorTestimonials } from "@/components/home/sections/creator-testimonials"
import { Process } from "@/components/home/sections/process"
import { Blog } from "@/components/home/sections/blog"
import { FAQ } from "@/components/home/sections/faq"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Buy & Sell YouTube Channels | YT Shop India Marketplace",
  description: "YT Shop India is the premier marketplace for buying and selling verified YouTube channels. Fast, secure, and trusted by thousands of creators.",
}

// Served from prerendered HTML for a fast TTFB.
//
// Freshness is on-demand, not on a timer: every route that changes what this
// page shows already calls `revalidatePath("/")`, so an edit is live on the
// next request - listings (admin create/update/delete), blog posts,
// testimonials, analytics videos, site settings, and the Cryptomus webhook
// that marks a channel sold.
//
// The 24h value is only a self-healing backstop for changes made outside those
// routes (a direct database edit, or an analytics video being deleted on
// YouTube). It is not the update path.
export const revalidate = 86400

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedListings />
      <WhyYtShop />
      <AnalyticsVideos />
      <CreatorTestimonials />
      <Process />
      <Blog />
      <FAQ />
    </main>
  )
}
