import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, MessageCircle, CreditCard, Mail, FileText, Share2, UserCheck, DollarSign, ArrowRight } from "lucide-react"

const buyerSteps = [
  {
    step: 1,
    icon: ShoppingCart,
    title: "Browse & Select",
    description: "Visit the buy channel page, identify a channel that meets your needs, and review its analytics data.",
  },
  {
    step: 2,
    icon: MessageCircle,
    title: "Get More Info",
    description: 'Click the "Get More Info" button to chat with us on WhatsApp. We will share additional information and analytics in accordance with our policy.',
  },
  {
    step: 3,
    icon: CreditCard,
    title: "Make Payment",
    description: "Once you have obtained the necessary details and verified them, you can make the payment to complete the purchase.",
  },
  {
    step: 4,
    icon: Mail,
    title: "Channel Transfer",
    description: "After making the full payment, provide us with a Gmail account. We will then begin the process of transferring the channel to the provided Gmail account.",
  },
]

const sellerSteps = [
  {
    step: 1,
    icon: FileText,
    title: "Fill the Form",
    description: "Visit the sell channel page and fill out the required form with accurate and relevant information about your channel.",
  },
  {
    step: 2,
    icon: Share2,
    title: "Share Analytics",
    description: "Once we connect with you over WhatsApp chat, you will need to share the analytics screenshots mentioned on the sell channel page.",
  },
  {
    step: 3,
    icon: UserCheck,
    title: "Transfer Ownership",
    description: "Once we have found a buyer for your channel, we will ask you to transfer the primary ownership of the channel to us.",
  },
  {
    step: 4,
    icon: DollarSign,
    title: "Receive Payment",
    description: "Provide us with your payment details and receive payment once the channel transfer is complete.",
  },
]

export function Process() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Simple, transparent processes for both buyers and sellers. Get started in just a few easy steps.
          </p>
        </div>

        {/* Process Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Buyer Process */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="mb-2 text-2xl font-bold text-foreground">
                For <span className="text-primary">Buyers</span>
              </h3>
              <p className="text-muted-foreground">
                Follow these simple steps to purchase your ideal YouTube channel
              </p>
            </div>

            <div className="space-y-6">
              {buyerSteps.map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={index}
                    className="group relative flex gap-4 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                  >
                    {/* Step Number */}
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                      <span className="text-lg font-bold">{item.step}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Icon className="size-5 text-primary" />
                        <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Seller Process */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="mb-2 text-2xl font-bold text-foreground">
                For <span className="text-primary">Sellers</span>
              </h3>
              <p className="text-muted-foreground">
                Sell your channel quickly and securely with our streamlined process
              </p>
            </div>

            <div className="space-y-6">
              {sellerSteps.map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={index}
                    className="group relative flex gap-4 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                  >
                    {/* Step Number */}
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                      <span className="text-lg font-bold">{item.step}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Icon className="size-5 text-primary" />
                        <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="mb-6 text-lg font-medium text-foreground">
            Ready to get started?
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
                Sell Your Channel
                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

