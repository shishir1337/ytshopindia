"use client"

import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, XCircle, Users, TrendingUp, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChannelCardProps {
  id: string
  channelImage: string
  title: string
  subscribers: number
  monetized: "Monetized" | "Non-Monetized" | "Demonetized"
  description: string
}

export function ChannelCard({
  channelImage,
  title,
  subscribers,
  monetized,
  description,
}: ChannelCardProps) {
  const formatSubscribers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const getMonetizedStatusColor = (status: string) => {
    switch (status) {
      case "Monetized":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
      case "Non-Monetized":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
      case "Demonetized":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getMonetizedIcon = (status: string) => {
    switch (status) {
      case "Monetized":
        return <CheckCircle2 className="size-3.5" />
      case "Non-Monetized":
      case "Demonetized":
        return <XCircle className="size-3.5" />
      default:
        return null
    }
  }

  return (
    <Link href={`/buy-channel/${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
        {/* Channel Image with Overlay */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={channelImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Monetization Badge on Image */}
          <div className="absolute top-3 left-3">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${getMonetizedStatusColor(monetized)}`}
            >
              {getMonetizedIcon(monetized)}
              <span>{monetized}</span>
            </div>
          </div>

          {/* Subscriber Count Badge on Image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex items-center gap-2 rounded-lg bg-black/70 backdrop-blur-sm px-3 py-2">
              <Users className="size-4 text-white" />
              <span className="text-sm font-bold text-white">{formatSubscribers(subscribers)}</span>
              <span className="text-xs text-white/80">Subscribers</span>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <h3 className="line-clamp-2 text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
              {title}
            </h3>
            <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Stats Section */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                <Users className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">Subscribers</span>
                <span className="text-lg font-bold text-foreground">{formatSubscribers(subscribers)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="size-4" />
              <span className="text-xs font-medium">Active</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            variant="outline"
            className="w-full group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-all duration-300 pointer-events-none"
          >
            View Details
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-xl border-2 border-primary/0 group-hover:border-primary/20 transition-colors duration-300 pointer-events-none" />
      </div>
    </Link>
  )
}
