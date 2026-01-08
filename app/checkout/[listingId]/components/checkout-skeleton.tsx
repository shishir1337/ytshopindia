import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CheckoutSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Skeleton className="h-9 w-32 mb-6" />
                
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <Skeleton className="h-5 w-5" />
                            <CardTitle>
                                <Skeleton className="h-7 w-32" />
                            </CardTitle>
                        </div>
                        <CardDescription>
                            <Skeleton className="h-4 w-64" />
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Logged in info skeleton */}
                        <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-40" />
                        </div>

                        {/* Form fields skeleton */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-3 w-64" />
                            </div>
                        </div>

                        {/* Payment method section */}
                        <div className="pt-4 border-t space-y-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-3 w-full" />
                        </div>

                        {/* Submit button */}
                        <Skeleton className="h-11 w-full mt-4" />

                        {/* Sign in link */}
                        <div className="mt-6 text-center">
                            <Skeleton className="h-4 w-48 mx-auto" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

