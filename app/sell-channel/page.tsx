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
      <section className="relative py-12 sm:py-16 lg:py-20 bg-muted overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
              Sell Your YouTube Channel With The <span className="text-primary">Most Trusted Platform</span>
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg max-w-3xl mx-auto">
              Want to sell your YouTube channel? Our platform offers top-notch services, trusted by thousands of creators, with a straightforward and easy process to sell your YouTube channel. Our team of experts provide support from start to finish, including negotiating the best price and ensuring a secure transaction. With our platform, you can sell your channel in the best possible way and get the most out of your YouTube channel.
            </p>
          </div>
        </div>
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
