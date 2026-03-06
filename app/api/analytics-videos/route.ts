import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const videos = await prisma.analyticsVideo.findMany({
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ videos });
    } catch (error: unknown) {
        console.error("Error fetching analytics videos:", error);
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
