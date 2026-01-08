"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [token, setToken] = useState<string | null>(null)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [validating, setValidating] = useState(true)

    useEffect(() => {
        const tokenParam = searchParams.get("token")
        if (!tokenParam) {
            toast.error("Invalid or missing reset token")
            setValidating(false)
            return
        }
        setToken(tokenParam)
        setValidating(false)
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!token) {
            toast.error("Invalid reset token")
            return
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long")
            return
        }

        setLoading(true)

        try {
            const { error } = await authClient.resetPassword({
                newPassword: password,
                token,
            })

            if (error) {
                toast.error(error.message || "Failed to reset password. The link may have expired.")
                return
            }

            setSuccess(true)
            toast.success("Password reset successfully!")
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        } catch (err) {
            toast.error("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (validating) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-center">
                            <Loader2 className="size-6 animate-spin text-primary" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!token) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                            <XCircle className="size-6 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Invalid Reset Link</CardTitle>
                        <CardDescription>
                            This password reset link is invalid or has expired
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg bg-muted p-4">
                            <p className="text-sm text-muted-foreground">
                                Password reset links expire after 1 hour for security reasons. Please request a new password reset link.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button asChild className="w-full">
                            <Link href="/forgot-password">Request New Reset Link</Link>
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

    if (success) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-500/10">
                            <CheckCircle2 className="size-6 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Password Reset Successful</CardTitle>
                        <CardDescription>
                            Your password has been reset successfully. Redirecting to login...
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href="/login">Go to Login</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                    <CardDescription>
                        Enter your new password below
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                autoFocus
                            />
                            <p className="text-xs text-muted-foreground">
                                Must be at least 8 characters long
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Resetting Password...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
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

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-center">
                            <Loader2 className="size-6 animate-spin text-primary" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
