import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Terms and Conditions | YTShop India",
    description: "Terms and Conditions for using YTShop India services.",
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <section className="relative py-20 bg-muted/30 border-b overflow-hidden">
                <div className="container px-4 mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                        Terms and <span className="text-primary">Conditions</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Please read these terms and conditions carefully before using our services.
                    </p>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-0" />
            </section>

            <section className="py-16 md:py-24">
                <div className="container px-4 mx-auto max-w-4xl">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to YTShop India. By accessing or using our website and services, you agree to be bound by these Terms and Conditions and our Privacy Policy.
                        </p>

                        <h2>2. Services</h2>
                        <p>
                            YTShop India provides a marketplace for buying and selling YouTube channels. We act as an intermediary to facilitate transactions between buyers and sellers.
                        </p>

                        <h2>3. User Responsibilities</h2>
                        <p>
                            Users are responsible for maintaining the confidentiality of their accounts and for all activities that occur under their account. You must provide accurate and complete information when using our services.
                        </p>

                        <h2>4. Transactions and Payments</h2>
                        <p>
                            All payments for channel acquisitions must be made through our authorized payment methods. We reserve the right to withhold payments or cancel transactions if fraudulent activity is suspected.
                        </p>

                        <h2>5. Intellectual Property</h2>
                        <p>
                            The content, features, and functionality of YTShop India are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
                        </p>

                        <h2>6. Liability</h2>
                        <p>
                            YTShop India shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the services.
                        </p>

                        <h2>7. Governing Law</h2>
                        <p>
                            These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                        </p>

                        <h2>8. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. We will notify users of any significant changes by posting the new terms on this page.
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
