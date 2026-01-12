import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET - Single testimonial
export async function GET(
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
        const testimonial = await prisma.testimonial.findUnique({
            where: { id },
        });

        if (!testimonial) {
            return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
        }

        return NextResponse.json({ testimonial });
    } catch (error: any) {
        console.error("Error fetching testimonial:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// PATCH - Update testimonial
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

        const testimonial = await prisma.testimonial.update({
            where: { id },
            data: body,
        });

        revalidatePath("/");

        return NextResponse.json({ testimonial });
    } catch (error: any) {
        console.error("Error updating testimonial:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Testimonial
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
        await prisma.testimonial.delete({
            where: { id },
        });

        revalidatePath("/");

        return NextResponse.json({ message: "Testimonial deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting testimonial:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
