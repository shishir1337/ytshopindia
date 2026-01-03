import { CheckCircle2, AlertCircle, FileText, TrendingUp } from "lucide-react"

export function SellChannelDetails() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Main Content Card */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm mb-6">
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="size-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Why Sell with YT SHOP INDIA?</h2>
              </div>
              <p className="text-base leading-relaxed text-muted-foreground">
                Selling a YouTube channel may be tedious. With <span className="font-semibold text-primary">YT SHOP INDIA</span>, you can expect a smooth and efficient selling process. Our team will evaluate your channel based on its analytics to ensure you receive the best price possible. Our platform has a large and engaged audience, giving you the confidence that your channel will be in good hands. Plus, with over <span className="font-semibold text-primary">2000+ satisfied creators</span>, you can trust that YT SHOP INDIA will provide a hassle-free and trustworthy experience. Don&apos;t waste any more time, fill out the form, connect with our seller support team, and get ready to sell your YouTube channel with ease. Join the ranks of successful creators and start your journey with YT SHOP INDIA today!
              </p>
            </div>
          </div>

          {/* Screenshots Required Card */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8 mb-6">
            <div className="mb-4 flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Analytics Screenshots Required
                </h3>
                <p className="text-sm text-muted-foreground">
                  After sending the message on WhatsApp, you need to provide 5-7 screenshots of your channel analytics for better price evaluation.
                </p>
              </div>
            </div>
            
            <div className="mt-5 rounded-lg border border-border bg-background p-5">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Required Screenshots:</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">1. YouTube Studio Home page</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">2. Lifetime views</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">3. Views in the last 28 days</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">4. Impression in the last 28 days</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">5. Watch Time (If not monetized)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">6. Last 28 days revenue (if monetized)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">7. Last 3 months revenue (if monetized)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">8. Lifetime revenue (if monetized)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Minimum Subscribers Notice */}
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-5 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-500" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  <span className="text-amber-600 dark:text-amber-500">Important Note:</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  To sell a channel, it must have minimum <span className="font-semibold text-foreground">1000 subscribers</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <p className="text-base leading-relaxed text-muted-foreground">
              At <span className="font-semibold text-primary">YT SHOP INDIA</span>, we&apos;re committed to making the process of selling your YouTube channel as seamless as possible. Our seller support team may reach out to you via WhatsApp for any additional information needed to evaluate your channel accurately. Our team will then determine the selling price based on the channel&apos;s analytics. Only after you agree to the offered price will the sale proceed. Let YT SHOP INDIA help you turn your channel into a profitable investment. Get in touch with us now!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
