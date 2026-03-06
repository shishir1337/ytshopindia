import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET - List all testimonials for admin
export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const testimonials = await prisma.testimonial.findMany({
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ testimonials });
    } catch (error: unknown) {
        console.error("Error fetching testimonials:", error);
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

// POST - Create new testimonial
export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { quote, name, designation, src, active, order } = body;

        if (!quote || !name || !designation || !src) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const testimonial = await prisma.testimonial.create({
            data: {
                quote,
                name,
                designation,
                src,
                active: active !== false,
                order: order || 0,
            },
        });

        revalidatePath("/");

        return NextResponse.json({ testimonial }, { status: 201 });
    } catch (error: unknown) {
        console.error("Error creating testimonial:", error);
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
