import { cache } from "react"
import { prisma } from "@/lib/prisma"
import {
  AnalyticsVideosCarousel,
  type CarouselVideo,
} from "./analytics-videos-carousel"

const YT_THUMB = /^https?:\/\/(img\.youtube\.com|i\.ytimg\.com)\/vi\/([\w-]+)\//

async function exists(url: string): Promise<boolean | null> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    if (response.ok) return true
    // Only a 404 is proof the image is gone; anything else (429, 5xx) is
    // treated as "unknown" so a hiccup at YouTube can't hide real videos.
    return response.status === 404 ? false : null
  } catch {
    return null
  }
}

/**
 * `maxresdefault.jpg` only exists for videos uploaded above a certain
 * resolution - it 404s for everything else, which is what produced the broken
 * thumbnails and console errors. `hqdefault.jpg` exists for every live video,
 * and because its 16:9 content is letterboxed inside a 4:3 frame,
 * `object-cover` in an aspect-video box crops back to exactly that 16:9 image.
 *
 * When neither exists the video itself has been deleted or made private on
 * YouTube, so there is nothing worth linking to.
 */
const resolveThumbnail = cache(
  async (thumbnail: string | null, videoId: string): Promise<string | null> => {
    const custom = thumbnail?.trim()

    // A custom (uploaded) thumbnail is used as-is.
    if (custom && !YT_THUMB.test(custom)) return custom

    const maxres = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    const hq = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

    if (await exists(maxres)) return maxres
    return (await exists(hq)) === false ? null : hq
  }
)

async function getAnalyticsVideos(): Promise<CarouselVideo[]> {
  try {
    const videos = await prisma.analyticsVideo.findMany({
      select: { id: true, videoId: true, title: true, thumbnail: true },
      orderBy: { order: "asc" },
    })

    const resolved = await Promise.all(
      videos.map(async (video) => {
        const thumbnail = await resolveThumbnail(video.thumbnail, video.videoId)
        if (!thumbnail) {
          console.warn(
            `Analytics video "${video.title}" (${video.videoId}) is no longer available on YouTube - hiding it.`
          )
          return null
        }
        return {
          id: video.id,
          videoId: video.videoId,
          title: video.title,
          thumbnail,
        }
      })
    )

    return resolved.filter((video): video is CarouselVideo => video !== null)
  } catch (error) {
    console.error("Error fetching analytics videos:", error)
    return []
  }
}

export async function AnalyticsVideos() {
  const videos = await getAnalyticsVideos()

  if (videos.length === 0) {
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

        <AnalyticsVideosCarousel videos={videos} />
      </div>
    </section>
  )
}
