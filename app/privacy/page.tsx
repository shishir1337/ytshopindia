import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy | YT Shop India",
    description: "Privacy Policy for YT Shop India services.",
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <section className="relative py-20 bg-muted/30 border-b overflow-hidden">
                <div className="container px-4 mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                        Privacy <span className="text-primary">Policy</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Your privacy is important to us. Here is how we handle your data.
                    </p>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-0" />
            </section>

            <section className="py-16 md:py-24">
                <div className="container px-4 mx-auto max-w-4xl">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <h2>1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, such as when you create an account, list a channel for sale, or communicate with us. This may include your name, email address, phone number, and payment information.
                        </p>

                        <h2>2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you about your account and our services.
                        </p>

                        <h2>3. Information Sharing</h2>
                        <p>
                            We do not share your personal information with third parties except as necessary to provide our services, comply with the law, or protect our rights. This may include sharing information with payment processors and potential buyers/sellers.
                        </p>

                        <h2>4. Data Security</h2>
                        <p>
                            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
                        </p>

                        <h2>5. Cookies</h2>
                        <p>
                            We use cookies and similar tracking technologies to track the activity on our service and hold certain information to enhance your experience.
                        </p>

                        <h2>6. Your Choices</h2>
                        <p>
                            You may update or correct your account information at any time by logging into your account or contacting us. You can also opt out of receiving promotional communications from us.
                        </p>

                        <h2>7. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at info@ytshopindia.com.
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
