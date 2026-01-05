import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <div className="relative mb-8">
                <h1 className="text-9xl font-extrabold text-primary/10">404</h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-2xl font-bold text-foreground">Page Not Found</p>
                </div>
            </div>

            <h2 className="mb-4 text-3xl font-bold tracking-tight">Oops! Lost in Space?</h2>
            <p className="mb-10 max-w-md text-muted-foreground leading-relaxed">
                The page you are looking for might have been removed, had its name changed,
                or is temporarily unavailable. Let's get you back on track.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline" size="lg" className="group">
                    <Link href="javascript:history.back()" className="flex items-center gap-2">
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                        Go Back
                    </Link>
                </Button>
                <Button asChild size="lg" className="group">
                    <Link href="/" className="flex items-center gap-2">
                        <Home className="size-4" />
                        Return Home
                    </Link>
                </Button>
            </div>

            {/* Decorative background element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
        </div>
    )
}
