import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentSkeleton() {
    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Payment Details Card Skeleton */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <Skeleton className="h-6 w-32" />
                            </CardTitle>
                            <CardDescription>
                                <Skeleton className="h-4 w-48 mt-2" />
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-5 w-20 rounded-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-28" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-32" />
                                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                    <Skeleton className="h-4 flex-1" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                            </div>
                            <div className="pt-4 border-t space-y-2">
                                <Skeleton className="h-4 w-40" />
                            </div>
                            <div className="pt-4">
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>

                    {/* Order Summary Card Skeleton */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <Skeleton className="h-6 w-32" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-20 h-20 rounded-lg" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-5 w-24 rounded-full" />
                                </div>
                            </div>
                            <div className="pt-4 border-t space-y-3">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                                <div className="pt-2 border-t">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-5 w-12" />
                                        <Skeleton className="h-5 w-16" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

