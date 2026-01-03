"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const maxIndex = videos.length - 3 // Show 3 at a time

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Watch Detailed <span className="text-primary">Analytics Videos</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Learn how to analyze channel performance, understand metrics, and make informed decisions.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 z-10 -translate-x-4 -translate-y-1/2 size-10 rounded-full bg-background shadow-lg hover:bg-primary hover:text-primary-foreground border-border"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            aria-label="Previous videos"
          >
            <ChevronLeft className="size-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 z-10 -translate-x-[-1rem] -translate-y-1/2 size-10 rounded-full bg-background shadow-lg hover:bg-primary hover:text-primary-foreground border-border"
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Next videos"
          >
            <ChevronRight className="size-5" />
          </Button>

          {/* Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(calc(-${currentIndex * (100 / 3)}% - ${currentIndex * 1.5}rem))`,
              }}
            >
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex-shrink-0"
                  style={{ width: "calc(33.333% - 1rem)" }}
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted transition-all duration-300 group-hover:shadow-xl">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="h-full w-full object-cover"
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all duration-300 group-hover:bg-black/50">
                        <div className="flex size-20 items-center justify-center rounded-full bg-primary backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/90 shadow-2xl">
                          <svg
                            className="ml-1 size-8 text-primary-foreground"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="0.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
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

