"use client"

import { useState } from "react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface LoginDialogProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function LoginDialog({ isOpen, onClose, onSuccess }: LoginDialogProps) {
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [registerName, setRegisterName] = useState("")
    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [loginLoading, setLoginLoading] = useState(false)
    const [registerLoading, setRegisterLoading] = useState(false)

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoginLoading(true)

        try {
            const { error } = await authClient.signIn.email({
                email: loginEmail,
                password: loginPassword,
            })

            if (error) {
                toast.error(error.message || "Invalid email or password")
                return
            }

            toast.success("Logged in successfully")
            onSuccess()
            onClose()
        } catch (err) {
            toast.error("An error occurred. Please try again.")
        } finally {
            setLoginLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setRegisterLoading(true)

        try {
            const { error } = await authClient.signUp.email({
                email: registerEmail,
                password: registerPassword,
                name: registerName,
            })

            if (error) {
                toast.error(error.message || "Something went wrong")
                return
            }

            toast.success("Account created successfully")
            onSuccess()
            onClose()
        } catch (err) {
            toast.error("An error occurred. Please try again.")
        } finally {
            setRegisterLoading(false)
        }
    }

    const handleClose = () => {
        if (!loginLoading && !registerLoading) {
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Sign in to purchase</DialogTitle>
                    <DialogDescription>
                        Create an account or sign in to buy this channel with crypto.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin" className="mt-4">
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input
                                    id="login-email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    required
                                    disabled={loginLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="login-password">Password</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-primary hover:underline"
                                        onClick={handleClose}
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="login-password"
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                    disabled={loginLoading}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loginLoading}>
                                {loginLoading ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="register" className="mt-4">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="register-name">Name</Label>
                                <Input
                                    id="register-name"
                                    placeholder="John Doe"
                                    value={registerName}
                                    onChange={(e) => setRegisterName(e.target.value)}
                                    required
                                    disabled={registerLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="register-email">Email</Label>
                                <Input
                                    id="register-email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                    required
                                    disabled={registerLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="register-password">Password</Label>
                                <Input
                                    id="register-password"
                                    type="password"
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                    required
                                    disabled={registerLoading}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={registerLoading}>
                                {registerLoading ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create account"
                                )}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
