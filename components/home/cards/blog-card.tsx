import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"

interface BlogCardProps {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
  slug: string
}

export function BlogCard({ title, excerpt, image, date, slug }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
        {/* Blog Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized={image.startsWith("/uploads/")}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Card Content */}
        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-1 flex-col space-y-4">
            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              <time dateTime={date}>{date}</time>
            </div>

            {/* Title */}
            <h3 className="line-clamp-2 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {excerpt}
            </p>
          </div>

          {/* Read More */}
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
            <span>Read More</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  )
}

