"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, CreditCard, Mail } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { CheckoutSkeleton } from "./components/checkout-skeleton"

export default function CheckoutPage() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const listingId = params.listingId as string

    const [loading, setLoading] = useState(false)
    const [checkingSession, setCheckingSession] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const [userName, setUserName] = useState("")
    const [channelAccessEmail, setChannelAccessEmail] = useState<string | null>(null)

    useEffect(() => {
        // Get channel access email from query params
        const accessEmail = searchParams.get("accessEmail")
        if (!accessEmail) {
            toast.error("Channel access email is required. Please go back and select an email.")
            router.push(`/buy-channel/${listingId}`)
            return
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(accessEmail)) {
            toast.error("Invalid email address. Please go back and enter a valid email.")
            router.push(`/buy-channel/${listingId}`)
            return
        }

        setChannelAccessEmail(accessEmail)

        // Check user session for guest email/name if needed
        const checkSession = async () => {
            try {
                const session = await authClient.getSession()
                if (session?.data?.user) {
                    setIsLoggedIn(true)
                    setUserEmail(session.data.user.email)
                    setUserName(session.data.user.name || "")
                }
            } catch (error) {
                // Not logged in - that's fine, we'll use guest checkout
            } finally {
                setCheckingSession(false)
            }
        }
        checkSession()
    }, [searchParams, listingId, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (!channelAccessEmail) {
                toast.error("Channel access email is required")
                setLoading(false)
                return
            }

            // For guest users, we still need guestEmail for order notifications
            // Use channelAccessEmail as guestEmail if user is not logged in
            const guestEmailForOrder = isLoggedIn ? null : channelAccessEmail
            const guestNameForOrder = isLoggedIn ? null : (userName || "Guest")

            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    listingId,
                    channelAccessEmail,
                    guestEmail: guestEmailForOrder,
                    guestName: guestNameForOrder,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "Failed to create order")
                setLoading(false)
                return
            }

            // Store email for guest orders to enable access later
            if (!isLoggedIn && channelAccessEmail && typeof window !== "undefined") {
                localStorage.setItem(`order_${data.order.id}_email`, channelAccessEmail)
            }

            toast.success("Order created! Redirecting to payment...")
            router.push(`/payment/${data.order.id}`)
        } catch (error: any) {
            console.error("Checkout error:", error)
            toast.error("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Show skeleton while checking session, but keep page structure
    if (checkingSession) {
        return <CheckoutSkeleton />
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Button asChild variant="ghost" size="sm" className="mb-6">
                    <Link href={`/buy-channel/${listingId}`}>
                        <ArrowLeft className="size-4 mr-2" />
                        Back to Listing
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="size-5 text-primary" />
                            <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
                        </div>
                        <CardDescription>
                            Complete your purchase with cryptocurrency
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {channelAccessEmail && (
                            <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Mail className="size-4 text-primary" />
                                    <p className="text-sm font-medium">Channel Access Email</p>
                                </div>
                                <p className="text-sm text-muted-foreground">{channelAccessEmail}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    This email will be used to assign channel access after purchase.
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium">Payment Method</span>
                                    <span className="text-sm text-muted-foreground">Cryptocurrency (USD)</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">
                                    You'll be redirected to complete payment with cryptocurrency after placing your order.
                                </p>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full" 
                                size="lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="mr-2 size-4" />
                                        Proceed to Payment
                                    </>
                                )}
                            </Button>
                        </form>

                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

