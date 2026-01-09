import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
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
