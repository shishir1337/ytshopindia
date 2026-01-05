import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;
        const filePath = join(process.cwd(), "public", "uploads", ...path);

        // Check if file exists
        if (!existsSync(filePath)) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // Read file
        const fileBuffer = await readFile(filePath);

        // Determine content type based on extension
        const ext = filePath.split(".").pop()?.toLowerCase();
        let contentType = "application/octet-stream";

        const mimeTypes: Record<string, string> = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'svg': 'image/svg+xml',
        };

        if (ext && mimeTypes[ext]) {
            contentType = mimeTypes[ext];
        }

        // Return the file with correct content type
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable", // Long cache for production
            },
        });
    } catch (error) {
        console.error("Error serving upload:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
