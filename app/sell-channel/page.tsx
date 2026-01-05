import { SellChannelForm } from "@/components/sell-channel/sell-channel-form"
import { SellChannelDetails } from "@/components/sell-channel/sell-channel-details"
import { FAQ } from "@/components/home/sections/faq"
import { Info, MessageCircle, CheckCircle2 } from "lucide-react"

export const metadata = {
  title: "Sell Your YouTube Channel | YT SHOP INDIA",
  description: "Sell your YouTube channel easily and securely. Get the best price for your channel with YT SHOP INDIA's trusted marketplace.",
}

export default function SellChannelPage() {
  return (
    <main>
      {/* Page Header */}
      <section className="relative py-20 bg-muted/30 border-b overflow-hidden">
        <div className="container px-4 mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Sell Your <span className="text-primary">YouTube Channel</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get the best price for your channel with the most trusted platform.
            Direct assistance from start to finish.
          </p>
        </div>
        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-0" />
      </section>

      {/* Quick Info Cards */}
      <section className="py-8 bg-background border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">2000+ Creators</p>
                <p className="text-xs text-muted-foreground">Trusted by sellers</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageCircle className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Quick Response</p>
                <p className="text-xs text-muted-foreground">24/7 WhatsApp support</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Info className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Fair Pricing</p>
                <p className="text-xs text-muted-foreground">Best market rates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                Fill Details in The Form Below and Get <span className="text-primary">Free Channel Valuation</span>
              </h2>
              <p className="text-muted-foreground">
                Our team will contact you via WhatsApp to discuss your channel valuation and next steps.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              <SellChannelForm />
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <SellChannelDetails />

      {/* FAQ Section */}
      <FAQ />
    </main>
  )
}
