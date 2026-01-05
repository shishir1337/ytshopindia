"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"

// Dummy YouTube video data - will be replaced with real data later
const videos = [
  {
    id: "1",
    videoId: "dQw4w9WgXcQ", // Placeholder - replace with actual YouTube video IDs
    title: "Channel Analytics Overview",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop",
  },
  {
    id: "2",
    videoId: "dQw4w9WgXcQ",
    title: "Subscriber Growth Analysis",
    thumbnail: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&h=450&fit=crop",
  },
  {
    id: "3",
    videoId: "dQw4w9WgXcQ",
    title: "Revenue Insights & Trends",
    thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop",
  },
  {
    id: "4",
    videoId: "dQw4w9WgXcQ",
    title: "Engagement Metrics Deep Dive",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
  },
  {
    id: "5",
    videoId: "dQw4w9WgXcQ",
    title: "Content Performance Review",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
  },
  {
    id: "6",
    videoId: "dQw4w9WgXcQ",
    title: "Channel Valuation Guide",
    thumbnail: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=450&fit=crop",
  },
]

export function AnalyticsVideos() {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [itemsToShow, setItemsToShow] = React.useState(3)

  // Calculate items to show based on window width
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1)
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2)
      } else {
        setItemsToShow(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxIndex = Math.max(0, videos.length - itemsToShow)

  // Reset index if it exceeds max after resize
  React.useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex)
    }
  }, [maxIndex, currentIndex])

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Watch Detailed <span className="text-primary">Analytics Videos</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground">
            Learn how to analyze channel performance, understand metrics, and make informed decisions.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-visible">
          {/* Navigation Buttons - Hidden on mobile, use swiping instead */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 z-10 -translate-x-4 -translate-y-1/2 size-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-primary hover:text-primary-foreground border-border hidden sm:flex"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            aria-label="Previous videos"
          >
            <ChevronLeft className="size-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 z-10 translate-x-4 -translate-y-1/2 size-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-primary hover:text-primary-foreground border-border hidden sm:flex"
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Next videos"
          >
            <ChevronRight className="size-5" />
          </Button>

          {/* Carousel Viewport */}
          <div className="relative px-0">
            <div className="overflow-visible sm:overflow-hidden">
              <motion.div
                className="flex gap-4 sm:gap-6"
                animate={{
                  x: `calc(-${currentIndex * (100 / itemsToShow)}% - ${currentIndex * (itemsToShow === 1 ? 0 : 1.5)}rem)`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  const threshold = 50
                  if (info.offset.x < -threshold && currentIndex < maxIndex) {
                    goToNext()
                  } else if (info.offset.x > threshold && currentIndex > 0) {
                    goToPrevious()
                  }
                }}
              >
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="flex-shrink-0"
                    style={{ width: `calc(${100 / itemsToShow}% - ${itemsToShow === 1 ? 0 : (itemsToShow - 1) * 1.5 / itemsToShow}rem)` }}
                  >
                    <a
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/20">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all duration-300 group-hover:bg-black/40">
                          <div className="flex size-12 sm:size-16 lg:size-20 items-center justify-center rounded-full bg-primary/95 text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-primary">
                            <svg
                              className="ml-1 size-6 sm:size-8 lg:size-10"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <h3 className="mt-3 text-sm font-semibold text-foreground line-clamp-1 sm:text-base group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                    </a>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="mt-6 sm:mt-10 flex justify-center gap-1.5 sm:gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${index === currentIndex
                    ? "w-6 sm:w-10 bg-primary"
                    : "w-1.5 sm:w-2 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
