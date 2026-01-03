import { Hero } from "@/components/home/sections/hero"
import { FeaturedListings } from "@/components/home/sections/featured-listings"
import { WhyYtShop } from "@/components/home/sections/why-ytshop"
import { AnalyticsVideos } from "@/components/home/sections/analytics-videos"
import { CreatorTestimonials } from "@/components/home/sections/creator-testimonials"
import { Process } from "@/components/home/sections/process"
import { Blog } from "@/components/home/sections/blog"
import { FAQ } from "@/components/home/sections/faq"

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
