"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Order {
    id: string
    status: string
    amount: string
    currency: string
    originalPrice: string
    originalCurrency: string
    deliveryDetails: string | null
    deliveredAt: Date | null
    createdAt: Date
    paidAt: Date | null
    channelListing: {
        id: string
        title: string
        featuredImage: string | null
        listingId: string | null
    }
}

interface OrdersListProps {
    orders: Order[]
    loading: boolean
}

export function OrdersList({ orders, loading }: OrdersListProps) {
    const router = useRouter()

    if (loading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                    >
                        <Skeleton className="w-20 h-20 rounded-lg" />
                        <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                <div className="space-y-2 text-right">
                                    <Skeleton className="h-4 w-20 ml-auto" />
                                    <Skeleton className="h-3 w-16 ml-auto" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-5 w-20 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                <Package className="size-12 mb-3 opacity-20" />
                <p className="font-medium">No orders found</p>
                <p className="text-sm max-w-xs mx-auto mt-1">
                    You haven't purchased any channels yet. Browse our marketplace to get started.
                </p>
                <Button variant="link" className="mt-2 text-primary" onClick={() => router.push("/buy-channel")}>
                    Browse Channels
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div
                    key={order.id}
                    className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                    {order.channelListing.featuredImage && (
                        <img
                            src={order.channelListing.featuredImage}
                            alt={order.channelListing.title}
                            className="w-20 h-20 rounded-lg object-cover"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-semibold text-sm">{order.channelListing.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Order #{order.id.slice(0, 8)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-sm">
                                    {order.currency} {order.amount}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {order.originalCurrency} {order.originalPrice}
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-xs">
                            <span className={`px-2 py-1 rounded ${
                                order.status === "completed" ? "bg-green-500/10 text-green-600" :
                                order.status === "delivered" ? "bg-purple-500/10 text-purple-600" :
                                order.status === "paid" ? "bg-blue-500/10 text-blue-600" :
                                order.status === "pending" ? "bg-yellow-500/10 text-yellow-600" :
                                "bg-gray-500/10 text-gray-600"
                            }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <span className="text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        {order.deliveryDetails && (
                            <div className="mt-3 p-3 bg-muted rounded-lg">
                                <p className="text-xs font-medium mb-1">Delivery Details:</p>
                                <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                                    {order.deliveryDetails}
                                </p>
                            </div>
                        )}
                        <div className="mt-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/payment/${order.id}`)}
                            >
                                View Details
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

