import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendOrderDeliveredEmail } from "@/lib/email";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    // Validate input
    const { deliverySchema } = await import("@/lib/validation");
    const validationResult = deliverySchema.safeParse(body);
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { deliveryDetails, deliveryNotes } = validationResult.data;

    // Get order with related data
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        channelListing: {
          select: {
            title: true,
            listingId: true,
          },
        },
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check order status - must be paid and not already delivered
    if (order.status === "delivered" || order.status === "completed") {
      return NextResponse.json(
        { error: "Order has already been delivered" },
        { status: 400 }
      );
    }

    if (order.status !== "paid") {
      return NextResponse.json(
        { error: "Order must be paid before delivery" },
        { status: 400 }
      );
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: "delivered",
        deliveredAt: new Date(),
        deliveredBy: session.user.id,
        deliveryDetails,
        deliveryNotes: deliveryNotes || null,
      },
    });

    // Send delivery email
    const customerEmail = order.user?.email || order.guestEmail;
    const customerName = order.user?.name || order.guestName || "Customer";

    if (customerEmail) {
      await sendOrderDeliveredEmail({
        to: customerEmail,
        orderId: order.id,
        channelTitle: order.channelListing.title,
        deliveryDetails,
        customerName,
      }).catch((error) => {
        console.error("Failed to send delivery email:", error);
        // Don't fail the request if email fails
      });
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Error marking order as delivered:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}

