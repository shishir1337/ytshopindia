import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET - List all analytics videos for admin
export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const videos = await prisma.analyticsVideo.findMany({
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ videos });
    } catch (error: any) {
        console.error("Error fetching analytics videos:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Create new analytics video
export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { videoId, title, thumbnail, order } = body;

        if (!videoId || !title) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Default thumbnail if not provided
        const videoThumbnail = thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        const video = await prisma.analyticsVideo.create({
            data: {
                videoId,
                title,
                thumbnail: videoThumbnail,
                order: order || 0,
            },
        });

        revalidatePath("/");

        return NextResponse.json({ video }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating analytics video:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
