import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewListingAdminNotification } from "@/lib/email";
import { sendWhatsAppNotification } from "@/lib/whatsapp";

// POST - Create new listing (from seller form)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      channelLink,
      sellerName,
      sellerEmail,
      sellerWhatsapp,
      expectedPrice,
      currency,
      featuredImage,
      images,
      monetizationStatus,
    } = body;

    if (!title || !sellerName || !sellerEmail || !sellerWhatsapp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate listing ID
    const listingId = `YT${Date.now().toString(36).toUpperCase()}`;

    // Store monetization status in description for now
    // Also set the monetized boolean based on status
    let finalDescription = description || "";
    let monetized = false;
    
    if (monetizationStatus) {
      if (finalDescription) {
        finalDescription = `${finalDescription}\n\nMonetization Status: ${monetizationStatus}`;
      } else {
        finalDescription = `Monetization Status: ${monetizationStatus}`;
      }
      
      // Set monetized boolean based on status
      monetized = monetizationStatus.toLowerCase() === "monetized";
    }

    const listing = await prisma.channelListing.create({
      data: {
        title,
        description: finalDescription || null,
        channelLink: channelLink || null,
        sellerName,
        sellerEmail,
        sellerWhatsapp,
        expectedPrice: expectedPrice || null,
        currency: currency || "₹",
        featuredImage: featuredImage || null,
        images: images || [],
        status: "pending", // Always pending on creation
        listingId,
        monetized,
      },
    });

    // Send email notification to admin (non-blocking)
    sendNewListingAdminNotification({
      listingTitle: title,
      sellerName,
      sellerEmail,
      sellerWhatsapp,
      listingId,
      expectedPrice,
      currency: currency || "₹",
      channelLink,
    }).catch((error) => {
      console.error("Failed to send admin notification email:", error);
      // Don't fail the request if email fails
    });

    // Generate WhatsApp notification URL
    const whatsappResult = await sendWhatsAppNotification({
      sellerName,
      sellerWhatsapp,
      channelLink: channelLink || null,
      monetizationStatus: monetizationStatus || "Not specified",
      sellerEmail,
      expectedPrice: expectedPrice || null,
      currency: currency || "₹",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Listing submitted successfully. It will be reviewed by our admin team.",
        listingId: listing.id,
        whatsappUrl: whatsappResult.url || null,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - List published listings (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;
    const category = searchParams.get("category");
    const status = searchParams.get("status") || "approved"; // Only show approved by default

    const where: any = { status };
    if (category) {
      where.category = category;
    }

    const [listings, total] = await Promise.all([
      prisma.channelListing.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          featuredImage: true,
          category: true,
          subscribers: true,
          viewsLast28Days: true,
          lifetimeViews: true,
          monetized: true,
          expectedPrice: true,
          currency: true,
          listingId: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
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

