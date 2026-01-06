import { Metadata } from "next"
import Link from "next/link"
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react"
import { IconBrandWhatsapp } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getSiteSettings } from "../(admin)/admin/settings/actions"

export const metadata: Metadata = {
    title: "Contact Us | YT Shop India",
    description: "Get in touch with YT Shop India. We are here to help you buy or sell YouTube channels.",
}

export default async function ContactPage() {
    const siteSettings = await getSiteSettings()
    const WHATSAPP_URL = `https://wa.me/${siteSettings.adminWhatsapp.replace(/[^0-9]/g, "")}`

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 bg-muted/30 border-b overflow-hidden">
                <div className="container px-4 mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                        Get in <span className="text-primary">Touch</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Have a question or need assistance? We're just a message away.
                    </p>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-0" />
            </section>

            {/* Contact Options */}
            <section className="py-16 md:py-24">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

                        {/* WhatsApp Card (Primary) */}
                        <Card className="border-[#25D366]/20 shadow-lg bg-[#25D366]/5 relative overflow-hidden group hover:border-[#25D366]/40 transition-all duration-300 md:col-span-2 lg:col-span-1 lg:row-span-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardContent className="p-8 flex flex-col items-center text-center h-full justify-center space-y-6 relative z-10">
                                <div className="p-4 bg-[#25D366]/20 rounded-full text-[#25D366] mb-2 ring-8 ring-[#25D366]/10">
                                    <IconBrandWhatsapp className="size-12" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">WhatsApp Support</h3>
                                    <p className="text-muted-foreground">
                                        For the fastest response, chat with us on WhatsApp. Our team is online and ready to help.
                                    </p>
                                </div>
                                <Button size="lg" className="bg-[#25D366] hover:bg-[#20ba59] text-white w-full sm:w-auto shadow-md" asChild>
                                    <Link href={WHATSAPP_URL} target="_blank">
                                        Chat Now
                                    </Link>
                                </Button>
                                <div className="space-y-1 pt-4 border-t border-[#25D366]/20 w-full text-sm text-muted-foreground">
                                    <div className="flex items-center justify-center gap-2">
                                        <Clock className="size-4" />
                                        <span>Average Response: &lt; 15 mins</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="size-2 rounded-full bg-[#25D366] animate-pulse" />
                                        <span>Online Now</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Email Card */}
                        <Card className="border-border shadow-sm hover:border-primary/50 transition-colors">
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <Mail className="size-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Email Us</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Prefer email? Send us a detailed message.
                                    </p>
                                    <Link
                                        href="mailto:info@ytshopindia.com"
                                        className="text-primary font-medium hover:underline text-lg block"
                                    >
                                        info@ytshopindia.com
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Phone Card */}
                        <Card className="border-border shadow-sm hover:border-primary/50 transition-colors">
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <Phone className="size-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Call Us</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Need to speak with someone directly?
                                    </p>
                                    <Link
                                        href={`tel:${siteSettings.adminWhatsapp}`}
                                        className="text-primary font-medium hover:underline text-lg block"
                                    >
                                        {siteSettings.adminWhatsapp}
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* FAQ Link Card */}
                        <div className="md:col-span-2 lg:col-span-2">
                            <Card className="bg-primary/5 border-primary/10">
                                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4 text-center md:text-left">
                                        <div className="p-3 bg-background rounded-full shrink-0 border border-primary/20 hidden md:block">
                                            <MessageSquare className="size-6 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
                                            <p className="text-muted-foreground">
                                                Find answers to common questions about buying and selling channels.
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="border-primary/20 hover:bg-primary/10" asChild>
                                        <Link href="/#faq">Visit FAQ</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    )
}
