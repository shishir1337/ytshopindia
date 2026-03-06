import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";
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

    if (!listing || listing.deletedAt) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ listing });
  } catch (error: unknown) {
    console.error("Error fetching listing:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
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

    // Check if listing exists and is not soft-deleted
    const existingListing = await prisma.channelListing.findUnique({
      where: { id },
    });

    if (!existingListing || existingListing.deletedAt) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // If status is being changed to approved, set approvedAt and approvedBy
    const updateData: Prisma.ChannelListingUpdateInput = { ...body } as Prisma.ChannelListingUpdateInput;
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

    // Revalidate paths to show fresh content
    revalidatePath("/");
    revalidatePath("/buy-channel");
    revalidatePath(`/buy-channel/${listing.id}`);

    return NextResponse.json({ listing });
  } catch (error: unknown) {
    console.error("Error updating listing:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
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

    // Soft delete: set deletedAt and status so FK remains valid
    await prisma.channelListing.update({
      where: { id },
      data: { deletedAt: new Date(), status: "deleted" },
    });

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/buy-channel");

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting listing:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

