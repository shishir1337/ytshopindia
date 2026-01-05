"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Users, DollarSign, X } from "lucide-react"

const subscriberFilters = [
    { value: "all", label: "All Subscribers" },
    { value: "below-5k", label: "Below 5K" },
    { value: "5k-20k", label: "5K - 20K" },
    { value: "20k-50k", label: "20K - 50K" },
    { value: "50k-100k", label: "50K - 100K" },
    { value: "100k-500k", label: "100K - 500K" },
    { value: "500k-1m", label: "500K - 1M" },
    { value: "above-1m", label: "Above 1M" },
]

const monetizationFilters = [
    { value: "all", label: "All Status" },
    { value: "monetized", label: "Monetized" },
    { value: "not-monetized", label: "Not Monetized" },
]

export function ChannelFilters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentSubscribers = searchParams.get("subscribers") || "all"
    const currentMonetization = searchParams.get("monetization") || "all"

    const hasActiveFilters = currentSubscribers !== "all" || currentMonetization !== "all"

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === "all") {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    const clearFilters = () => {
        router.push(pathname)
    }

    return (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
                {/* Subscribers Filter */}
                <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    <Select
                        value={currentSubscribers}
                        onValueChange={(value) => updateFilter("subscribers", value)}
                    >
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Subscribers" />
                        </SelectTrigger>
                        <SelectContent>
                            {subscriberFilters.map((filter) => (
                                <SelectItem key={filter.value} value={filter.value}>
                                    {filter.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Monetization Filter */}
                <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-muted-foreground" />
                    <Select
                        value={currentMonetization}
                        onValueChange={(value) => updateFilter("monetization", value)}
                    >
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Monetization" />
                        </SelectTrigger>
                        <SelectContent>
                            {monetizationFilters.map((filter) => (
                                <SelectItem key={filter.value} value={filter.value}>
                                    {filter.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X className="size-4 mr-1" />
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
    )
}
