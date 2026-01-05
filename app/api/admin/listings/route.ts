import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";

// GET - List all listings (admin only)
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [listings, total] = await Promise.all([
      prisma.channelListing.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          listingId: true,
          status: true,
          sellerName: true,
          sellerEmail: true,
          category: true,
          subscribers: true,
          expectedPrice: true,
          currency: true,
          createdAt: true,
          updatedAt: true,
          approvedAt: true,
        },
      }),
      prisma.channelListing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create manual listing (admin only)
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Basic validation
    if (!data.title || !data.sellerName || !data.sellerEmail || !data.sellerWhatsapp) {
      return NextResponse.json(
        { error: "Title, Seller Name, Email, and WhatsApp are required" },
        { status: 400 }
      );
    }

    // Generate unique listingId if not provided
    let listingId = data.listingId;
    if (!listingId) {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      listingId = `CH-${timestamp}${random}`;
    }

    // Create listing
    const listing = await prisma.channelListing.create({
      data: {
        ...data,
        listingId,
        status: data.status || "approved", // Default to approved for admin creation
        approvedAt: (data.status === "approved" || !data.status) ? new Date() : null,
        approvedBy: (data.status === "approved" || !data.status) ? session.user.name : null,
      },
    });

    // Revalidate paths for immediate updates
    revalidatePath("/");
    revalidatePath("/buy-channel");

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

