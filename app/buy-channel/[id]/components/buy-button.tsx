"use client"

import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { DollarSign } from "lucide-react"
import { ChannelAccessDialog } from "./channel-access-dialog"

interface BuyButtonProps {
    listingId: string
}

export function BuyButton({ listingId }: BuyButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
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

    return (
        <>
            <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-white border-none shadow-lg"
                onClick={() => setIsDialogOpen(true)}
                disabled={loading}
            >
                <DollarSign className="size-5 mr-2" />
                Buy with Crypto
            </Button>

            <ChannelAccessDialog
                listingId={listingId}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                userEmail={userEmail}
            />
        </>
    )
}

