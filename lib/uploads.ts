import { existsSync } from "fs"
import { join } from "path"

/**
 * Server-only. Resolves an image reference stored in the database.
 *
 * Uploads live on a mounted volume, so a row can easily outlive its file (and
 * several rows already point at images that were never restored). Returning
 * `null` for those lets components render a real placeholder instead of
 * emitting a request that is known to 404.
 *
 * Do not import this from a client component - it pulls in `fs`.
 */
export function resolveUploadedImage(
  src: string | null | undefined
): string | null {
  const trimmed = src?.trim()
  if (!trimmed) return null

  // Remote URLs (YouTube, Unsplash, ...) are passed straight through.
  if (!trimmed.startsWith("/uploads/")) return trimmed

  const uploadsRoot = join(process.cwd(), "public", "uploads")
  // During a container build the uploads volume is not mounted yet - assume
  // the file is fine rather than wrongly blanking every image.
  if (!existsSync(uploadsRoot)) return trimmed

  const relative = trimmed.split("?")[0].replace(/^\/uploads\//, "")
  if (!relative || relative.includes("..")) return null

  return existsSync(join(uploadsRoot, ...relative.split("/"))) ? trimmed : null
}
