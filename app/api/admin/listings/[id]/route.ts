import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendListingApprovedSellerNotification } from "@/lib/email";

// GET - Get single listing
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
    const listing = await prisma.channelListing.findUnique({
      where: { id },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ listing });
  } catch (error: any) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update listing
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

    // Check if listing exists
    const existingListing = await prisma.channelListing.findUnique({
      where: { id },
    });

    if (!existingListing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // If status is being changed to approved, set approvedAt and approvedBy
    const updateData: any = { ...body };
    const isBeingApproved = body.status === "approved" && existingListing.status !== "approved";
    
    if (isBeingApproved) {
      updateData.approvedAt = new Date();
      updateData.approvedBy = session.user.id;
    }

    // Generate listing ID if not exists and being approved
    if (isBeingApproved && !existingListing.listingId) {
      updateData.listingId = `YT${Date.now().toString(36).toUpperCase()}`;
    }

    const listing = await prisma.channelListing.update({
      where: { id },
      data: updateData,
    });

    // Send email notification to seller if listing was just approved (non-blocking)
    if (isBeingApproved) {
      const listingUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/listings/${listing.id}`;
      
      sendListingApprovedSellerNotification({
        listingTitle: listing.title,
        sellerName: listing.sellerName,
        sellerEmail: listing.sellerEmail,
        listingId: listing.listingId || listing.id,
        listingUrl,
      }).catch((error) => {
        console.error("Failed to send seller notification email:", error);
        // Don't fail the request if email fails
      });
    }

    return NextResponse.json({ listing });
  } catch (error: any) {
    console.error("Error updating listing:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete listing
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

    await prisma.channelListing.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

