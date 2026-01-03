"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle, MessageCircle } from "lucide-react"

const faqs = [
  {
    question: "How do I buy a YouTube channel?",
    answer:
      "To buy a YouTube channel, visit our buy channel page, browse through available listings, and click 'Get More Info' on any channel that interests you. This will connect you with us on WhatsApp where we'll share detailed analytics and answer your questions. Once you're satisfied, make the payment and provide a Gmail account for channel transfer.",
  },
  {
    question: "What information do I need to sell my channel?",
    answer:
      "To sell your channel, you'll need to fill out our form with your name, WhatsApp number, channel link, monetization status, email, and expected price. After connecting on WhatsApp, you'll need to share analytics screenshots. Once a buyer is found, you'll transfer channel ownership and provide payment details.",
  },
  {
    question: "How is the channel transfer process handled?",
    answer:
      "After full payment is received, you provide us with a Gmail account. We then initiate the transfer process, moving the channel's primary ownership to your provided Gmail account. The entire process is secure and follows YouTube's official transfer protocols.",
  },
  {
    question: "Are the channels verified before listing?",
    answer:
      "Yes, all channels listed on YT SHOP INDIA are verified for authenticity. We ensure genuine metrics, active communities, and accurate monetization status before any channel is listed on our platform.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Payment details are discussed during the WhatsApp conversation. We ensure secure and transparent payment processing for all transactions. All payment information is shared directly through our verified WhatsApp channel.",
  },
  {
    question: "Can I negotiate the price?",
    answer:
      "Yes, pricing can be discussed during the WhatsApp conversation. We facilitate transparent communication between buyers and sellers to reach mutually agreeable terms.",
  },
  {
    question: "How long does the channel transfer take?",
    answer:
      "The channel transfer process typically takes a few business days after payment confirmation. The exact timeline depends on YouTube's processing time and can be discussed during your WhatsApp conversation with our team.",
  },
  {
    question: "What if I have issues after purchasing a channel?",
    answer:
      "Our 24/7 support team is available on WhatsApp to assist you with any issues. We provide ongoing support to ensure a smooth experience throughout and after the channel transfer process.",
  },
]

export function FAQ() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-muted/30 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <HelpCircle className="size-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Frequently Asked{" "}
            <span className="text-primary">Questions</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Find answers to common questions about buying and selling YouTube channels on YT SHOP INDIA.
          </p>
        </div>

        {/* FAQ Accordion - Two Column Layout */}
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Left Column */}
            <div>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.slice(0, Math.ceil(faqs.length / 2)).map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="group rounded-xl border border-border bg-card px-6 py-1 shadow-sm transition-all duration-300 data-[state=open]:border-primary/50 data-[state=open]:bg-primary/5 data-[state=open]:shadow-lg hover:border-primary/30"
                  >
                    <AccordionTrigger className="py-5 text-left font-semibold text-foreground hover:text-primary transition-colors hover:no-underline [&>svg]:text-primary [&>svg]:transition-transform">
                      <span className="pr-4 text-base sm:text-lg">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-muted-foreground leading-relaxed text-sm sm:text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Right Column */}
            <div>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.slice(Math.ceil(faqs.length / 2)).map((faq, index) => {
                  const actualIndex = Math.ceil(faqs.length / 2) + index
                  return (
                    <AccordionItem
                      key={actualIndex}
                      value={`item-${actualIndex}`}
                      className="group rounded-xl border border-border bg-card px-6 py-1 shadow-sm transition-all duration-300 data-[state=open]:border-primary/50 data-[state=open]:bg-primary/5 data-[state=open]:shadow-lg hover:border-primary/30"
                    >
                      <AccordionTrigger className="py-5 text-left font-semibold text-foreground hover:text-primary transition-colors hover:no-underline [&>svg]:text-primary [&>svg]:transition-transform">
                        <span className="pr-4 text-base sm:text-lg">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-muted-foreground leading-relaxed text-sm sm:text-base">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-4 shadow-sm">
            <MessageCircle className="size-5 text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Still have questions?</p>
              <a
                href="https://wa.me/919101782780"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Contact us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
