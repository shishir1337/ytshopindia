"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Youtube } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogHeader,
} from "@/components/ui/dialog"
import { Maximize2 } from "lucide-react"

interface ImageCarouselProps {
    images: string[]
    title: string
}

export function ImageCarousel({ images, title }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [direction, setDirection] = React.useState(0)

    // Auto-slide every 5 seconds
    React.useEffect(() => {
        if (images.length <= 1) return

        const timer = setInterval(() => {
            handleNext()
        }, 5000)

        return () => clearInterval(timer)
    }, [currentIndex, images.length])

    const handleNext = () => {
        setDirection(1)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }

    const handlePrev = () => {
        setDirection(-1)
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }

    const goToSlide = (index: number) => {
        setDirection(index > currentIndex ? 1 : -1)
        setCurrentIndex(index)
    }

    if (images.length === 0) {
        return (
            <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted">
                <Youtube className="size-20 text-muted-foreground/50" />
            </div>
        )
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    }

    return (
        <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black/95 flex items-center justify-center">
            {/* Main Image */}
            <div className="relative h-full w-full">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0 flex items-center justify-center cursor-zoom-in group/image"
                    >
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="relative h-full w-full">
                                    <Image
                                        src={images[currentIndex]}
                                        alt={`${title} - Image ${currentIndex + 1}`}
                                        fill
                                        className="object-contain"
                                        priority
                                        unoptimized={images[currentIndex].startsWith("/uploads/")}
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
                                    <img
                                        src={images[currentIndex]}
                                        alt={`${title} - Preview`}
                                        className="h-full w-full object-contain rounded-lg"
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                        aria-label="Next image"
                    >
                        <ChevronRight className="size-6" />
                    </button>

                    {/* Indicators/Dots */}
                    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={cn(
                                    "size-2.5 rounded-full transition-all",
                                    index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                                )}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
