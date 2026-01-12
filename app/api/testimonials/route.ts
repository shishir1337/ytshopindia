import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - List active testimonials for public site
export async function GET() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            where: { active: true },
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ testimonials });
    } catch (error: any) {
        console.error("Error fetching public testimonials:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
