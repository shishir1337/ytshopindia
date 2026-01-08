"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ChannelAccessDialogProps {
    listingId: string
    isOpen: boolean
    onClose: () => void
    userEmail?: string | null
}

export function ChannelAccessDialog({
    listingId,
    isOpen,
    onClose,
    userEmail,
}: ChannelAccessDialogProps) {
    const router = useRouter()
    const [emailOption, setEmailOption] = useState<"account" | "custom">(
        userEmail ? "account" : "custom"
    )
    const [customEmail, setCustomEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleContinue = async () => {
        setLoading(true)

        try {
            let finalEmail = ""

            if (emailOption === "account" && userEmail) {
                finalEmail = userEmail
            } else {
                finalEmail = customEmail.trim()
            }

            // Validate email
            if (!finalEmail) {
                toast.error("Email address is required")
                setLoading(false)
                return
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(finalEmail)) {
                toast.error("Please enter a valid email address")
                setLoading(false)
                return
            }

            // Navigate to checkout with email in query params
            router.push(`/checkout/${listingId}?accessEmail=${encodeURIComponent(finalEmail)}`)
            onClose()
        } catch (error) {
            console.error("Error in channel access dialog:", error)
            toast.error("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        if (!loading) {
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="size-5" />
                        Channel Access Email
                    </DialogTitle>
                    <DialogDescription>
                        Please provide the email address where you want to receive channel access.
                        This email will be used by our admin team to assign the channel to you after
                        purchase.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {userEmail ? (
                        <div className="space-y-3">
                            <div
                                className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${
                                    emailOption === "account"
                                        ? "border-primary bg-primary/5"
                                        : "hover:bg-accent/50"
                                }`}
                                onClick={() => setEmailOption("account")}
                            >
                                <input
                                    type="radio"
                                    id="account"
                                    name="emailOption"
                                    value="account"
                                    checked={emailOption === "account"}
                                    onChange={() => setEmailOption("account")}
                                    className="size-4"
                                />
                                <Label
                                    htmlFor="account"
                                    className="flex-1 cursor-pointer font-normal"
                                >
                                    <div className="font-medium">Use my account email</div>
                                    <div className="text-sm text-muted-foreground">{userEmail}</div>
                                </Label>
                            </div>

                            <div
                                className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${
                                    emailOption === "custom"
                                        ? "border-primary bg-primary/5"
                                        : "hover:bg-accent/50"
                                }`}
                                onClick={() => setEmailOption("custom")}
                            >
                                <input
                                    type="radio"
                                    id="custom"
                                    name="emailOption"
                                    value="custom"
                                    checked={emailOption === "custom"}
                                    onChange={() => setEmailOption("custom")}
                                    className="size-4"
                                />
                                <Label
                                    htmlFor="custom"
                                    className="flex-1 cursor-pointer font-normal"
                                >
                                    <div className="font-medium">Use a different email</div>
                                </Label>
                            </div>
                        </div>
                    ) : null}

                    {(!userEmail || emailOption === "custom") && (
                        <div className="space-y-2">
                            <Label htmlFor="customEmail">
                                Email Address <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="customEmail"
                                type="email"
                                placeholder="[email protected]"
                                value={customEmail}
                                onChange={(e) => setCustomEmail(e.target.value)}
                                required
                                pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">
                                This email will be used to assign channel access after purchase.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleContinue} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Continue"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

