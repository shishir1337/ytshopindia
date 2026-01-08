"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"
import { toast } from "sonner"
import { DashboardSkeleton } from "./components/dashboard-skeleton"
import { OrdersList } from "./components/orders-list"

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

export default function DashboardPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [orders, setOrders] = useState<Order[]>([])
    const [ordersLoading, setOrdersLoading] = useState(true)

    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await authClient.getSession()
                if (!session.data?.user) {
                    router.replace("/login")
                    return
                }
                setUser(session.data.user)
                
                // Fetch orders
                const ordersResponse = await fetch("/api/orders")
                if (ordersResponse.ok) {
                    const data = await ordersResponse.json()
                    setOrders(data.orders || [])
                }
            } catch (error) {
                console.error("Session check failed", error)
                router.replace("/login")
            } finally {
                setLoading(false)
                setOrdersLoading(false)
            }
        }
        checkSession()
    }, [router])

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Logged out successfully")
                    router.replace("/login")
                    router.refresh()
                },
            },
        })
    }

    // Show skeleton while loading, but keep page structure
    if (loading || !user) {
        return <DashboardSkeleton />
    }

    return (
        <div className="container px-4 py-8 mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Manage your account and view your orders</p>
                </div>
                <Button variant="outline" onClick={handleLogout} className="shrink-0">
                    <LogOut className="mr-2 size-4" />
                    Sign Out
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Profile Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Your personal account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="size-16">
                                <AvatarImage src={user.image} alt={user.name} />
                                <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-lg">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Member Since:</span>
                                <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Card */}
                <Card className="md:col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Your channel purchase history</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrdersList orders={orders} loading={ordersLoading} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
