"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global Error:", error)
    }, [error])

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-8 p-4 rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="size-12" />
            </div>

            <h1 className="mb-4 text-3xl font-bold tracking-tight">Something went wrong!</h1>
            <p className="mb-10 max-w-md text-muted-foreground leading-relaxed">
                An unexpected error occurred. Our team has been notified.
                Please try refreshing the page or head back home.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" size="lg" onClick={() => reset()} className="group">
                    <RotateCcw className="mr-2 size-4 transition-transform group-hover:rotate-180" />
                    Try Again
                </Button>
                <Button asChild size="lg">
                    <Link href="/">
                        <Home className="mr-2 size-4" />
                        Return Home
                    </Link>
                </Button>
            </div>

            {/* Decorative background element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-destructive/5 rounded-full blur-3xl -z-10" />
        </div>
    )
}
