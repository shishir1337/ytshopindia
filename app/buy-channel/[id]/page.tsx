import { notFound } from "next/navigation"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    Users,
    Eye,
    Calendar,
    CheckCircle2,
    XCircle,
    Youtube,
    MessageCircle,
    TrendingUp,
    Clock,
    AlertTriangle,
    DollarSign,
    Video,
    Globe,
    ExternalLink,
} from "lucide-react"
import { ImageCarousel } from "../components/image-carousel"
import { IconBrandWhatsapp } from "@tabler/icons-react"
import { BuyButton } from "./components/buy-button"

interface PageProps {
    params: Promise<{ id: string }>
}

async function getListing(id: string) {
    try {
        const listing = await prisma.channelListing.findUnique({
            where: { id },
        })
        return listing
    } catch (error) {
        console.error("Error fetching listing:", error)
        return null
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    const listing = await getListing(id)

    if (!listing) {
        return {
            title: "Channel Not Found | YT SHOP INDIA",
        }
    }

    return {
        title: `${listing.title} | Buy YouTube Channel | YT SHOP INDIA`,
        description: listing.description || `Buy ${listing.title} YouTube channel on YT SHOP INDIA.`,
    }
}

// Parse subscriber string to number
function parseSubscriberCount(subs: string | null | undefined): number {
    if (!subs) return 0
    const cleaned = subs.replace(/[^0-9.]/g, "")
    const num = parseFloat(cleaned)
    if (subs.toLowerCase().includes("m")) {
        return num * 1000000
    }
    if (subs.toLowerCase().includes("k")) {
        return num * 1000
    }
    return isNaN(num) ? 0 : num
}

// Format number for display
function formatNumber(count: number): string {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
}

// Format date
function formatDate(date: Date | null | undefined): string {
    if (!date) return "N/A"
    return new Intl.DateTimeFormat("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(date))
}

export default async function ListingDetailsPage({ params }: PageProps) {
    const { id } = await params
    const listing = await getListing(id)

    if (!listing || listing.status !== "approved") {
        notFound()
    }

    const subscriberCount = parseSubscriberCount(listing.subscribers)
    const viewsCount = parseSubscriberCount(listing.viewsLast28Days)
    const lifetimeViewsCount = parseSubscriberCount(listing.lifetimeViews)

    const whatsappMessage = encodeURIComponent(
        `Hi, I'm interested in the YouTube channel "${listing.title}" (ID: ${listing.listingId || listing.id}) listed on YT SHOP INDIA. Can you provide more details?`
    )
    const whatsappUrl = `https://wa.me/919999999999?text=${whatsappMessage}`

    // Collect all images for the carousel
    const allImages = []
    if (listing.featuredImage) allImages.push(listing.featuredImage)
    if (listing.images && listing.images.length > 0) {
        allImages.push(...listing.images)
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Back Navigation */}
            <div className="border-b border-border bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/buy-channel">
                            <ArrowLeft className="size-4 mr-2" />
                            Back to Listings
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Carousel */}
                        <div className="relative">
                            <ImageCarousel images={allImages} title={listing.title} />

                            {/* Monetization Badge Overlay */}
                            <div className="absolute top-4 left-4 z-20">
                                <Badge
                                    variant={listing.monetized ? "default" : "secondary"}
                                    className={`${listing.monetized
                                        ? "bg-green-500/90 hover:bg-green-500/90 text-white"
                                        : "bg-yellow-500/90 hover:bg-yellow-500/90 text-white"
                                        } flex items-center gap-1.5 px-3 py-1.5 shadow-sm`}
                                >
                                    {listing.monetized ? (
                                        <CheckCircle2 className="size-4" />
                                    ) : (
                                        <XCircle className="size-4" />
                                    )}
                                    {listing.monetized ? "Monetized" : "Not Monetized"}
                                </Badge>
                            </div>
                        </div>

                        {/* Title and Description */}
                        <div>
                            <div className="flex items-start gap-3 mb-4">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                                    {listing.title}
                                </h1>
                            </div>
                            <div className="mb-4 space-y-2">
                                {listing.listingId && (
                                    <p className="text-sm text-muted-foreground">
                                        Listing ID: <span className="font-mono font-medium">{listing.listingId}</span>
                                    </p>
                                )}
                                {listing.channelLink && (
                                    <p className="text-sm text-muted-foreground">
                                        Channel Link:{" "}
                                        <a
                                            href={listing.channelLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                                        >
                                            {listing.channelLink}
                                            <ExternalLink className="size-3.5" />
                                        </a>
                                    </p>
                                )}
                            </div>
                            {listing.description && (
                                <div className="prose prose-sm max-w-none text-muted-foreground">
                                    <p className="whitespace-pre-wrap">{listing.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Channel Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <StatCard
                                icon={<Users className="size-5" />}
                                label="Subscribers"
                                value={subscriberCount > 0 ? formatNumber(subscriberCount) : listing.subscribers || "N/A"}
                            />
                            <StatCard
                                icon={<Eye className="size-5" />}
                                label="Views (28 Days)"
                                value={viewsCount > 0 ? formatNumber(viewsCount) : listing.viewsLast28Days || "N/A"}
                            />
                            <StatCard
                                icon={<TrendingUp className="size-5" />}
                                label="Lifetime Views"
                                value={lifetimeViewsCount > 0 ? formatNumber(lifetimeViewsCount) : listing.lifetimeViews || "N/A"}
                            />
                            <StatCard
                                icon={<Video className="size-5" />}
                                label="Videos"
                                value={listing.videoCount || "N/A"}
                            />
                        </div>

                        {/* Additional Details */}
                        <div className="rounded-xl border border-border bg-card p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Channel Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailItem icon={<Globe className="size-4" />} label="Language" value={listing.language || "N/A"} />
                                <DetailItem icon={<Youtube className="size-4" />} label="Category" value={listing.category || "N/A"} />
                                <DetailItem icon={<Video className="size-4" />} label="Channel Type" value={listing.channelType || "N/A"} />
                                <DetailItem icon={<TrendingUp className="size-4" />} label="Content Type" value={listing.contentType || "N/A"} />
                                <DetailItem icon={<Calendar className="size-4" />} label="Created" value={formatDate(listing.creationDate)} />
                                <DetailItem icon={<Clock className="size-4" />} label="Listed" value={formatDate(listing.createdAt)} />
                            </div>
                        </div>

                        {/* Revenue & Strikes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Revenue Info */}
                            <div className="rounded-xl border border-border bg-card p-6">
                                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <DollarSign className="size-5 text-green-500" />
                                    Revenue Details
                                </h2>
                                <div className="space-y-3">
                                    <DetailItem label="Revenue Sources" value={listing.revenueSources || "N/A"} />
                                    <DetailItem label="Monthly Revenue" value={listing.monthlyRevenue || "N/A"} />
                                    <DetailItem label="Revenue (90 Days)" value={listing.revenueLast28Days || "N/A"} />
                                    <DetailItem label="Lifetime Revenue" value={listing.lifetimeRevenue || "N/A"} />
                                </div>
                            </div>

                            {/* Strikes Info */}
                            <div className="rounded-xl border border-border bg-card p-6">
                                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <AlertTriangle className="size-5 text-yellow-500" />
                                    Channel Health
                                </h2>
                                <div className="space-y-3">
                                    <DetailItem
                                        label="Copyright Strikes"
                                        value={listing.copyrightStrike || "None"}
                                        valueClass={listing.copyrightStrike && listing.copyrightStrike !== "None" ? "text-red-500" : "text-green-500"}
                                    />
                                    <DetailItem
                                        label="Community Strikes"
                                        value={listing.communityStrike || "None"}
                                        valueClass={listing.communityStrike && listing.communityStrike !== "None" ? "text-red-500" : "text-green-500"}
                                    />
                                    <DetailItem
                                        label="Warning"
                                        value={listing.shortsViews90Days || "None"}
                                        valueClass={listing.shortsViews90Days && listing.shortsViews90Days !== "None" ? "text-red-500" : "text-green-500"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Price & Contact Card */}
                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <div className="text-center mb-6">
                                    <p className="text-sm text-muted-foreground mb-2">Price</p>
                                    <div className="text-3xl font-bold text-primary">
                                        {listing.expectedPrice ? (
                                            `${listing.currency}${listing.expectedPrice}`
                                        ) : (
                                            <span className="text-lg">Contact for Price</span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <BuyButton listingId={listing.id} />

                                    <Button asChild size="lg" variant="outline" className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white border-none shadow-lg">
                                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                            <IconBrandWhatsapp className="size-5 mr-2" />
                                            Buy with INR
                                        </a>
                                    </Button>
                                </div>

                                <p className="text-xs text-center text-muted-foreground mt-3">
                                    Choose your preferred payment method
                                </p>
                            </div>

                            {/* Quick Stats */}
                            <div className="rounded-xl border border-border bg-card p-6">
                                <h3 className="font-semibold text-foreground mb-4">Quick Overview</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Status</span>
                                        <Badge variant="default">Available</Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Monetization</span>
                                        <span className={`font-medium ${listing.monetized ? "text-green-500" : "text-yellow-500"}`}>
                                            {listing.monetized ? "Enabled" : "Not Enabled"}
                                        </span>
                                    </div>
                                    {listing.category && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Category</span>
                                            <span className="font-medium text-foreground">{listing.category}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="flex justify-center mb-2 text-primary">{icon}</div>
            <p className="text-lg font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    )
}

function DetailItem({
    icon,
    label,
    value,
    valueClass = "",
}: {
    icon?: React.ReactNode
    label: string
    value: string
    valueClass?: string
}) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                {icon}
                {label}
            </span>
            <span className={`text-sm font-medium text-foreground ${valueClass}`}>{value}</span>
        </div>
    )
}
