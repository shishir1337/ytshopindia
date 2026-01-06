import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Refund Policy | YT Shop India",
    description: "Refund Policy for items purchased through YT Shop India.",
}

export default function RefundPage() {
    return (
        <div className="min-h-screen bg-background">
            <section className="relative py-20 bg-muted/30 border-b overflow-hidden">
                <div className="container px-4 mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                        Refund <span className="text-primary">Policy</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Information about our refund and cancellation policies.
                    </p>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-0" />
            </section>

            <section className="py-16 md:py-24">
                <div className="container px-4 mx-auto max-w-4xl">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <h2>1. Refund Eligibility</h2>
                        <p>
                            Due to the nature of digital assets (YouTube channels), refunds are generally not provided once the transfer process has been initiated or completed. However, we may consider refunds in specific cases where the service was not delivered as described.
                        </p>

                        <h2>2. Cancellation Policy</h2>
                        <p>
                            You may request to cancel a transaction before the channel transfer process has begun. Once the transfer process is initiated, cancellations are no longer possible.
                        </p>

                        <h2>3. Transfer Disruptions</h2>
                        <p>
                            If a channel transfer is blocked or reversed due to issues with the seller's account or channel status that were not disclosed, we will work with both parties to resolve the issue or provide a refund to the buyer.
                        </p>

                        <h2>4. Refund Process</h2>
                        <p>
                            To request a refund, please contact us at info@ytshopindia.com within 24 hours of the transaction. Please include your order details and the reason for the refund request.
                        </p>

                        <h2>5. Processing Time</h2>
                        <p>
                            Approved refunds will be processed within 7-10 business days to the original payment method used during the transaction.
                        </p>

                        <h2>6. Exceptions</h2>
                        <p>
                            We reserve the right to deny refund requests if we suspect any fraudulent activity or violation of our Terms and Conditions.
                        </p>

                        <p className="mt-12 text-sm text-muted-foreground">
                            Last updated: January 5, 2026
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
