import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Users, TrendingUp, CheckCircle2, Headphones, ArrowRight } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Trusted marketplace with verified channels and secure payment processing. Your safety is our priority.",
  },
  {
    icon: Zap,
    title: "Instant Access",
    description: "Get immediate access to premium YouTube channels. No waiting, no delays - start growing today.",
  },
  {
    icon: Users,
    title: "Verified Sellers",
    description: "All channels are verified for authenticity. We ensure genuine metrics and active communities.",
  },
  {
    icon: TrendingUp,
    title: "Growth Potential",
    description: "Handpicked channels with proven growth trajectories and monetization opportunities.",
  },
  {
    icon: CheckCircle2,
    title: "Easy Process",
    description: "Simple listing and buying process. From discovery to ownership in just a few steps.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support team available round the clock to assist you throughout your journey.",
  },
]

export function WhyYtShop() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-background overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Why{" "}
            <span className="text-primary">YT SHOP INDIA</span>
            ?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            India&apos;s most trusted platform for buying and selling YouTube channels. 
            Experience seamless transactions with verified listings and dedicated support.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1"
              >
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/5 blur-xl transition-all duration-300 -z-10" />

                {/* Icon with Enhanced Styling */}
                <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/50 group-hover:scale-110">
                  <Icon className="size-7 transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>

                {/* Decorative Corner Glow */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/0 group-hover:bg-primary/5 rounded-bl-full blur-2xl transition-all duration-300 -z-10" />
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="mb-6 text-lg font-medium text-foreground">
            Ready to start your YouTube journey?
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="group">
              <Link href="/buy-channel">
                Browse Channels
                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="group">
              <Link href="/sell-channel">
                List Your Channel
                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
