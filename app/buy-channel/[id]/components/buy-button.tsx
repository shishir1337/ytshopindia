"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { DollarSign } from "lucide-react"
import { ChannelAccessDialog } from "./channel-access-dialog"
import { LoginDialog } from "./login-dialog"

interface BuyButtonProps {
    listingId: string
}

export function BuyButton({ listingId }: BuyButtonProps) {
    const router = useRouter()
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
    const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await authClient.getSession()
                if (session?.data?.user?.email) {
                    setUserEmail(session.data.user.email)
                }
            } catch (error) {
                // Not logged in
            } finally {
                setLoading(false)
            }
        }
        checkSession()
    }, [])

    const handleBuyClick = () => {
        if (userEmail) {
            setIsChannelDialogOpen(true)
        } else {
            setIsLoginDialogOpen(true)
        }
    }

    const handleLoginSuccess = () => {
        router.refresh()
        authClient.getSession().then((session) => {
            if (session?.data?.user?.email) {
                setUserEmail(session.data.user.email)
                setIsChannelDialogOpen(true)
            }
        })
    }

    return (
        <>
            <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-white border-none shadow-lg"
                onClick={handleBuyClick}
                disabled={loading}
            >
                <DollarSign className="size-5 mr-2" />
                Buy with Crypto
            </Button>

            <LoginDialog
                isOpen={isLoginDialogOpen}
                onClose={() => setIsLoginDialogOpen(false)}
                onSuccess={handleLoginSuccess}
            />

            <ChannelAccessDialog
                listingId={listingId}
                isOpen={isChannelDialogOpen}
                onClose={() => setIsChannelDialogOpen(false)}
                userEmail={userEmail}
            />
        </>
    )
}

