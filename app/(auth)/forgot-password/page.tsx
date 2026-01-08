"use client"

import { useState } from "react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Mail } from "lucide-react"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || window.location.origin
            const { error } = await authClient.requestPasswordReset({
                email,
                redirectTo: `${baseUrl}/reset-password`,
            })

            if (error) {
                toast.error(error.message || "Failed to send reset email")
                return
            }

            setEmailSent(true)
            toast.success("Password reset email sent! Check your inbox.")
        } catch (err) {
            toast.error("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (emailSent) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                            <Mail className="size-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                        <CardDescription>
                            We've sent a password reset link to <strong>{email}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg bg-muted p-4">
                            <p className="text-sm text-muted-foreground">
                                Click the link in the email to reset your password. The link will expire in 1 hour.
                            </p>
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                            <p>Didn't receive the email?</p>
                            <ul className="mt-2 space-y-1 text-left">
                                <li>• Check your spam folder</li>
                                <li>• Make sure you entered the correct email</li>
                                <li>• Wait a few minutes and try again</li>
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                setEmailSent(false)
                                setEmail("")
                            }}
                        >
                            Try another email
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            <Link href="/login" className="text-primary hover:underline inline-flex items-center gap-1">
                                <ArrowLeft className="size-3" />
                                Back to login
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email address and we'll send you a link to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <div className="text-center text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <Link href="/login" className="text-primary hover:underline inline-flex items-center gap-1">
                            <ArrowLeft className="size-3" />
                            Back to login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

