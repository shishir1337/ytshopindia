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
