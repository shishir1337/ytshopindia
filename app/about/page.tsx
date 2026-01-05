import { Metadata } from "next"
import Link from "next/link"
import { Target, Users, ThumbsUp, CheckCircle2 } from "lucide-react"
import { IconBrandWhatsapp } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "About Us | YTShop India",
    description: "Learn more about YTShop India, the premier marketplace for buying and selling YouTube channels in India.",
}

const ADMIN_WHATSAPP = "+919101782780"
const WHATSAPP_URL = `https://wa.me/${ADMIN_WHATSAPP.replace(/[^0-9]/g, "")}`

const stats = [
    { label: "Trust Creators", value: "2000+", icon: Users },
    { label: "Satisfaction Ratio", value: "99.9%", icon: ThumbsUp },
    { label: "Expert Support", value: "24/7", icon: CheckCircle2 },
]

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 bg-muted/30 border-b overflow-hidden">
                <div className="container px-4 mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                        About <span className="text-primary">YTShop India</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Bridging the Gap between You and YouTube Success with YTShop India
                    </p>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-0" />
            </section>

            {/* Mission Section */}
            <section className="py-16 md:py-24">
                <div className="container px-4 mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                <Target className="size-4" />
                                Our Mission
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                                Empowering Your Journey to Becoming a Great YouTuber
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Do you have a dream of becoming a great YouTuber? We are ready to support you in your sweet journey.
                                Whether you're looking to acquire an established audience or find a new home for your channel,
                                we provide the tools and security you need.
                            </p>
                            <div className="space-y-4">
                                <p className="text-muted-foreground">
                                    YTShop India is a one-stop-shop for all your YouTube channel needs. We understand the value of
                                    your time and effort, and that's why we strive to make the process of buying and selling YouTube
                                    channels as smooth and seamless as possible.
                                </p>
                                <p className="text-muted-foreground">
                                    With a team of experts and a passion for delivering excellence, YTShop India is the platform
                                    you can trust to take the next step in your digital career.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-background to-muted/50">
                                <CardContent className="p-8 space-y-6">
                                    <h3 className="text-2xl font-bold">Trusted by the Community</h3>
                                    <div className="grid sm:grid-cols-3 gap-6">
                                        {stats.map((stat, idx) => {
                                            const Icon = stat.icon
                                            return (
                                                <div key={idx} className="flex flex-col items-center text-center space-y-2">
                                                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                                        <Icon className="size-6" />
                                                    </div>
                                                    <div className="font-bold text-2xl">{stat.value}</div>
                                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-[#25D366]/20 shadow-md bg-[#25D366]/5 hover:bg-[#25D366]/10 transition-colors">
                                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6 justify-between text-center md:text-left">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold flex items-center gap-2 justify-center md:justify-start">
                                            <IconBrandWhatsapp className="size-6 text-[#25D366]" />
                                            Get Live Support
                                        </h3>
                                        <p className="text-sm text-muted-foreground max-w-sm">
                                            Have questions? Our experts are available on WhatsApp to assist you with buying, selling, or any other queries.
                                        </p>
                                    </div>
                                    <Button asChild className="bg-[#25D366] hover:bg-[#20ba59] text-white shrink-0 shadow-sm">
                                        <Link href={WHATSAPP_URL} target="_blank">Chat with Us</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-muted/50 border-y">
                <div className="container px-4 mx-auto text-center max-w-3xl">
                    <h2 className="text-3xl font-bold mb-6">Ready to Scale Your Presence?</h2>
                    <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                        We are passionate about helping creators reach their goals and we look forward to working with you.
                        Join the YTShop India community today and take the first step towards growing your YouTube channel.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" asChild>
                            <Link href="/buy-channel">Browse Channels</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/sell-channel">Sell Your Channel</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
