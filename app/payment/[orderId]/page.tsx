"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle, Copy, ExternalLink, Clock, QrCode } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { PaymentSkeleton } from "./components/payment-skeleton"

interface PaymentData {
    id: string
    amount: string
    currency: string
    paymentAddress: string
    paymentNetwork: string
    paymentAmount: string
    paymentUrl: string
    status: string
    paymentStatus: string
    expiresAt: number
    channelListing: {
        title: string
        featuredImage: string | null
    }
}

export default function PaymentPage() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = params.orderId as string
    const statusParam = searchParams.get("status")

    const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
    const [loading, setLoading] = useState(true)
    const [checkingPayment, setCheckingPayment] = useState(false)

    useEffect(() => {
        fetchOrder()

        // Poll payment status every 10 seconds if not paid
        let interval: NodeJS.Timeout | null = null

        const startPolling = () => {
            interval = setInterval(() => {
                if (paymentData && paymentData.status !== "paid" && paymentData.status !== "completed" && paymentData.status !== "expired" && paymentData.status !== "cancelled") {
                    checkPaymentStatus()
                } else {
                    // Stop polling if payment is final
                    if (interval) {
                        clearInterval(interval)
                        interval = null
                    }
                }
            }, 10000)
        }

        // Start polling after initial fetch
        const timeout = setTimeout(() => {
            startPolling()
        }, 1000)

        return () => {
            if (interval) clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [orderId, paymentData?.status])

    const fetchOrder = async () => {
        try {
            // Try to get email from localStorage (for guest orders)
            const storedEmail = typeof window !== "undefined" ? localStorage.getItem(`order_${orderId}_email`) : null;
            const url = storedEmail ? `/api/orders/${orderId}?email=${encodeURIComponent(storedEmail)}` : `/api/orders/${orderId}`;

            const response = await fetch(url)
            const data = await response.json()

            if (!response.ok) {
                if (data.requiresEmail && data.requiresEmail === true) {
                    // Need email verification - prompt user
                    const email = prompt("Please enter the email address used for this order:")
                    if (email) {
                        // Store email for future requests
                        if (typeof window !== "undefined") {
                            localStorage.setItem(`order_${orderId}_email`, email)
                        }
                        // Retry with email
                        const retryResponse = await fetch(`/api/orders/${orderId}?email=${encodeURIComponent(email)}`)
                        const retryData = await retryResponse.json()
                        if (retryResponse.ok) {
                            setPaymentData(retryData.order)
                        } else {
                            toast.error(retryData.error || "Access denied")
                            router.push("/buy-channel")
                        }
                    } else {
                        toast.error("Email is required to view this order")
                        router.push("/buy-channel")
                    }
                } else {
                    toast.error(data.error || "Order not found")
                    router.push("/buy-channel")
                }
                return
            }

            setPaymentData(data.order)
        } catch (error) {
            console.error("Error fetching order:", error)
            toast.error("Failed to load order details")
        } finally {
            setLoading(false)
        }
    }

    const checkPaymentStatus = async () => {
        setCheckingPayment(true)
        try {
            // Get email from localStorage if available
            const storedEmail = typeof window !== "undefined" ? localStorage.getItem(`order_${orderId}_email`) : null;
            const url = storedEmail ? `/api/orders/${orderId}/check-payment?email=${encodeURIComponent(storedEmail)}` : `/api/orders/${orderId}/check-payment`;

            const response = await fetch(url, {
                method: "POST",
            })
            const data = await response.json()

            if (data.order) {
                setPaymentData(data.order)

                if (data.order.status === "paid") {
                    toast.success("Payment confirmed! Redirecting...")
                    setTimeout(() => {
                        router.push(`/payment/${orderId}?status=success`)
                    }, 2000)
                }
            } else if (data.error) {
                toast.error(data.error || "Failed to check payment status")
            }
        } catch (error) {
            console.error("Error checking payment:", error)
            toast.error("Failed to check payment status. Please try again.")
        } finally {
            setCheckingPayment(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard!")
    }

    const formatExpiryTime = (expiry: number | string) => {
        const date = typeof expiry === 'number' ? new Date(expiry * 1000) : new Date(expiry)
        return date.toLocaleString()
    }

    // Show skeleton while loading, but keep page structure
    if (loading) {
        return <PaymentSkeleton />
    }

    if (!paymentData) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="pt-6 text-center">
                        <XCircle className="size-12 text-destructive mx-auto mb-4" />
                        <p className="text-lg font-semibold mb-2">Order Not Found</p>
                        <Button asChild>
                            <Link href="/buy-channel">Browse Channels</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const isPaid = paymentData.status === "paid" || paymentData.status === "completed"
    const isExpired = paymentData.status === "expired" || paymentData.status === "cancelled"
    const isPending = paymentData.status === "pending"

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {statusParam === "success" && isPaid && (
                    <Card className="mb-6 border-green-500 bg-green-500/5">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="size-6 text-green-500" />
                                <div>
                                    <p className="font-semibold text-green-500">Payment Successful!</p>
                                    <p className="text-sm text-muted-foreground">
                                        Your payment has been confirmed. You'll receive an email with order details shortly.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Payment Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Details</CardTitle>
                            <CardDescription>
                                Send the exact amount to the address below
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-xs text-muted-foreground">Order ID</Label>
                                <p className="font-mono text-sm">{orderId}</p>
                            </div>

                            <div>
                                <Label className="text-xs text-muted-foreground">Amount (USD)</Label>
                                <p className="text-2xl font-bold">${paymentData.amount}</p>
                            </div>

                            <div>
                                <Label className="text-xs text-muted-foreground">Network</Label>
                                <Badge variant="outline">{paymentData.paymentNetwork}</Badge>
                            </div>

                            <div>
                                <Label className="text-xs text-muted-foreground">Payment Amount</Label>
                                <p className="font-mono text-lg font-semibold">{paymentData.paymentAmount}</p>
                            </div>

                            <div>
                                <Label className="text-xs text-muted-foreground mb-2 block">
                                    Payment Address
                                </Label>
                                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                    <p className="font-mono text-xs flex-1 break-all">
                                        {paymentData.paymentAddress}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => copyToClipboard(paymentData.paymentAddress)}
                                    >
                                        <Copy className="size-4" />
                                    </Button>
                                </div>
                            </div>

                            {isPending && (
                                <div className="pt-4 border-t">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="size-4" />
                                        <span>Expires: {formatExpiryTime(paymentData.expiresAt)}</span>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4">
                                <Button
                                    asChild
                                    className="w-full"
                                    variant={isPaid ? "outline" : "default"}
                                >
                                    <a
                                        href={paymentData.paymentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLink className="mr-2 size-4" />
                                        {isPaid ? "View Payment Details" : "Pay with Cryptomus"}
                                    </a>
                                </Button>
                            </div>

                            {isPending && (
                                <Button
                                    onClick={checkPaymentStatus}
                                    disabled={checkingPayment}
                                    variant="outline"
                                    className="w-full"
                                >
                                    {checkingPayment ? (
                                        <>
                                            <Loader2 className="mr-2 size-4 animate-spin" />
                                            Checking...
                                        </>
                                    ) : (
                                        "Check Payment Status"
                                    )}
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                {paymentData.channelListing.featuredImage && (
                                    <Image
                                        src={paymentData.channelListing.featuredImage}
                                        alt={paymentData.channelListing.title}
                                        width={80}
                                        height={80}
                                        className="rounded-lg object-cover"
                                    />
                                )}
                                <div>
                                    <p className="font-semibold">{paymentData.channelListing.title}</p>
                                    <Badge
                                        variant={isPaid ? "default" : isExpired ? "destructive" : "secondary"}
                                        className="mt-2"
                                    >
                                        {isPaid ? "Paid" : isExpired ? "Expired" : "Pending Payment"}
                                    </Badge>
                                </div>
                            </div>

                            <div className="pt-4 border-t space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">${paymentData.amount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Currency</span>
                                    <span className="font-medium">{paymentData.currency}</span>
                                </div>
                                <div className="pt-2 border-t">
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>${paymentData.amount}</span>
                                    </div>
                                </div>
                            </div>

                            {isPaid && (
                                <div className="pt-4 border-t">
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Your order is being processed. You'll receive delivery details via email once ready.
                                    </p>
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href="/dashboard">Go to Dashboard</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <label className={`block text-xs font-medium mb-1 ${className}`}>{children}</label>
}

