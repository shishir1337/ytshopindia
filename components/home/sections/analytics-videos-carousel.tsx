"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface CarouselVideo {
  id: string
  videoId: string
  title: string
  thumbnail: string
}

/**
 * Native scroll-snap carousel.
 *
 * Deliberately CSS-driven: the browser handles the swipe gesture and the
 * momentum on the compositor, so there is no animation library, no drag
 * handler and no window-width measurement on mount (which used to cause a
 * layout shift and a forced reflow).
 */
export function AnalyticsVideosCarousel({ videos }: { videos: CarouselVideo[] }) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [page, setPage] = React.useState(0)
  const [pageCount, setPageCount] = React.useState(1)

  const measure = React.useCallback(() => {
    const el = trackRef.current
    if (!el || el.clientWidth === 0) return
    setPageCount(Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth)))
    setPage(Math.round(el.scrollLeft / el.clientWidth))
  }, [])

  React.useEffect(() => {
    const el = trackRef.current
    if (!el) return

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure])

  // Throttle scroll reads to one per frame so the dots never block scrolling.
  React.useEffect(() => {
    const el = trackRef.current
    if (!el) return

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setPage(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)))
      })
    }

    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      el.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const scrollToPage = (index: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" })
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 z-10 -translate-x-4 -translate-y-1/2 size-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-primary hover:text-primary-foreground border-border hidden sm:flex"
        onClick={() => scrollToPage(page - 1)}
        disabled={page <= 0}
        aria-label="Previous videos"
      >
        <ChevronLeft className="size-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 z-10 translate-x-4 -translate-y-1/2 size-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-primary hover:text-primary-foreground border-border hidden sm:flex"
        onClick={() => scrollToPage(page + 1)}
        disabled={page >= pageCount - 1}
        aria-label="Next videos"
      >
        <ChevronRight className="size-5" />
      </Button>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-1 sm:gap-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((video) => (
          <div
            key={video.id}
            className="w-full shrink-0 snap-start sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/20">
                <Image
                  src={video.thumbnail}
                  // Decorative: the video title is rendered as text right below.
                  alt=""
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all duration-300 group-hover:bg-black/40">
                  <div className="flex size-12 sm:size-16 lg:size-20 items-center justify-center rounded-full bg-primary/95 text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-primary">
                    <svg
                      className="ml-1 size-6 sm:size-8 lg:size-10"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
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
      </div>

      {pageCount > 1 && (
        <div className="mt-6 flex justify-center gap-1 sm:mt-10">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollToPage(index)}
              // The button itself is the 32px touch target; the pill inside is
              // just the visual indicator.
              className="flex h-8 min-w-8 items-center justify-center px-1"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === page ? "true" : undefined}
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 sm:h-2 ${
                  index === page
                    ? "w-6 bg-primary sm:w-10"
                    : "w-1.5 bg-muted-foreground/20 hover:bg-muted-foreground/40 sm:w-2"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
