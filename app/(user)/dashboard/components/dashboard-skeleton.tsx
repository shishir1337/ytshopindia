import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardSkeleton() {
    return (
        <div className="container px-4 py-8 mx-auto space-y-8">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-5 w-64" />
                </div>
                <Skeleton className="h-10 w-24" />
            </div>

            {/* Cards Grid Skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Profile Card Skeleton */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className="h-6 w-40" />
                        </CardTitle>
                        <CardDescription>
                            <Skeleton className="h-4 w-32 mt-2" />
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-16 w-16 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        </div>
                        <div className="pt-4 border-t space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Card Skeleton */}
                <Card className="md:col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className="h-6 w-32" />
                        </CardTitle>
                        <CardDescription>
                            <Skeleton className="h-4 w-40 mt-2" />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                                >
                                    <Skeleton className="w-20 h-20 rounded-lg" />
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-4 w-48" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                            <div className="space-y-2 text-right">
                                                <Skeleton className="h-4 w-20 ml-auto" />
                                                <Skeleton className="h-3 w-16 ml-auto" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Skeleton className="h-5 w-20 rounded-full" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                        <Skeleton className="h-8 w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

