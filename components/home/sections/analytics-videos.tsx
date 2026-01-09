"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"

export function AnalyticsVideos() {
  const [videos, setVideos] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [itemsToShow, setItemsToShow] = React.useState(3)

  // Fetch videos from API
  React.useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/analytics-videos")
        if (response.ok) {
          const data = await response.json()
          setVideos(data.videos)
        }
      } catch (error) {
        console.error("Error fetching analytics videos:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

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

  if (loading || videos.length === 0) {
    if (loading) {
      return (
        <div className="py-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )
    }
    return null
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
