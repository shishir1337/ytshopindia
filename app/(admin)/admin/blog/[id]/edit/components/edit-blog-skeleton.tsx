import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export function EditBlogSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/blog">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <Skeleton className="h-10 w-24" />
            </div>

            {/* Form Skeleton */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-12" />
                            <div className="flex gap-2">
                                <Skeleton className="h-10 flex-1" />
                                <Skeleton className="h-10 w-10" />
                            </div>
                            <Skeleton className="h-3 w-64" />
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-64 w-full rounded-md" />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Publish Settings */}
                    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-48 w-full rounded-md" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

