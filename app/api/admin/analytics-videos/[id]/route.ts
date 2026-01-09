import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// PATCH - Update analytics video
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { videoId, title, thumbnail, order } = body;

        const data: any = {};
        if (videoId) data.videoId = videoId;
        if (title) data.title = title;
        if (thumbnail) data.thumbnail = thumbnail;
        if (order !== undefined) data.order = order;

        const video = await prisma.analyticsVideo.update({
            where: { id },
            data,
        });

        revalidatePath("/");

        return NextResponse.json({ video });
    } catch (error: any) {
        console.error("Error updating analytics video:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Delete analytics video
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await prisma.analyticsVideo.delete({
            where: { id },
        });

        revalidatePath("/");

        return NextResponse.json({ message: "Video deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting analytics video:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
