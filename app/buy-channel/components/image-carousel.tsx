"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Youtube, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogHeader,
} from "@/components/ui/dialog"

interface ImageCarouselProps {
    images: string[]
    title: string
}

export function ImageCarousel({ images, title }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0)

    // Auto-slide every 5 seconds.
    React.useEffect(() => {
        if (images.length <= 1) return

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        }, 5000)

        return () => clearInterval(timer)
    }, [images.length])

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }

    if (images.length === 0) {
        return (
            <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted">
                <Youtube className="size-20 text-muted-foreground/50" />
            </div>
        )
    }

    return (
        <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black/95">
            {/* Slides: a single transformed track, so the transition runs on the
                compositor instead of through an animation library. */}
            <div
                className="flex h-full w-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((image, index) => (
                    <div key={`${image}-${index}`} className="relative h-full w-full shrink-0">
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="group/image relative h-full w-full cursor-zoom-in">
                                    <Image
                                        src={image}
                                        alt={`${title} - Image ${index + 1}`}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 800px"
                                        className="object-contain"
                                        priority={index === 0}
                                        // Off-screen slides sit outside the
                                        // viewport, so lazy loading would blank
                                        // them mid-transition.
                                        loading={index === 0 ? undefined : "eager"}
                                    />
                                    {/* Preview Label */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover/image:bg-black/20">
                                        <div className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-white opacity-0 transition-opacity group-hover/image:opacity-100">
                                            <Maximize2 className="size-4" />
                                            <span className="text-sm font-medium">Click to Preview</span>
                                        </div>
                                    </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-7xl border-none bg-transparent p-0 shadow-none outline-none overflow-hidden sm:max-w-[90vw] md:max-w-[95vw]">
                                <DialogHeader className="sr-only">
                                    <DialogTitle>Image Preview</DialogTitle>
                                </DialogHeader>
                                <div className="relative aspect-auto h-full max-h-[90vh] w-full flex items-center justify-center">
                                    <Image
                                        src={image}
                                        alt={`${title} - Preview`}
                                        width={1600}
                                        height={900}
                                        sizes="95vw"
                                        className="h-full w-full object-contain rounded-lg"
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100 focus-visible:opacity-100"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100 focus-visible:opacity-100"
                        aria-label="Next image"
                    >
                        <ChevronRight className="size-6" />
                    </button>

                    {/* Indicators/Dots */}
                    <div className="absolute bottom-1 left-1/2 z-10 flex -translate-x-1/2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className="flex size-7 items-center justify-center"
                                aria-label={`Go to slide ${index + 1}`}
                                aria-current={index === currentIndex ? "true" : undefined}
                            >
                                <span
                                    className={cn(
                                        "block size-2.5 rounded-full transition-all",
                                        index === currentIndex
                                            ? "bg-white scale-125"
                                            : "bg-white/50 hover:bg-white/80"
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
