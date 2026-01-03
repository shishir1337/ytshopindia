import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { ArrowRight, TrendingUp, Users, DollarSign } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-12 sm:py-16 lg:py-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <TrendingUp className="size-4" />
            <span>India&apos;s #1 YouTube Channel Marketplace</span>
          </div>

          {/* Main Heading */}
          <h1 className="mb-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Buy & Sell YouTube Channels
            <span className="block text-primary">Instantly & Securely</span>
          </h1>

          {/* Description */}
          <p className="mb-8 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Connect with creators, grow your digital presence, and monetize your YouTube journey. 
            Trusted marketplace for buying and selling YouTube channels in India.
          </p>

          {/* CTA Buttons */}
          <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto text-base px-8 py-6">
              <Link href="/buy-channel">
                Browse Channels
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-6">
              <Link href="/sell-channel">
                Sell Your Channel
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col items-center">
              <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="size-6" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                <AnimatedCounter value={1000} duration={2000} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground">Active Channels</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <DollarSign className="size-6" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                <AnimatedCounter value={50} duration={2000} prefix="₹" suffix="M+" />
              </div>
              <div className="text-sm text-muted-foreground">Total Transactions</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <TrendingUp className="size-6" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                <AnimatedCounter value={98} duration={2000} suffix="%" />
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

