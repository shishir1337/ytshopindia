import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getCryptomusPaymentStatus } from "@/lib/cryptomus";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email"); // For guest order verification
    
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order || !order.cryptomusOrderId) {
      return NextResponse.json(
        { error: "Order not found or payment not initialized" },
        { status: 404 }
      );
    }

    // Check if user has access to this order
    let userId: string | null = null;
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      userId = session?.user?.id || null;
    } catch (error) {
      // Not logged in
    }

    const { checkOrderAccess } = await import("@/lib/order-access");
    const accessCheck = await checkOrderAccess(id, userId, email || null);
    
    if (!accessCheck.hasAccess) {
      if (!order.userId && order.guestEmail) {
        return NextResponse.json(
          { 
            error: "Email verification required",
            requiresEmail: true,
          },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: accessCheck.reason || "Unauthorized" },
        { status: 403 }
      );
    }

    // Get payment status from Cryptomus
    const paymentStatus = await getCryptomusPaymentStatus(order.cryptomusOrderId);

    // Update order based on payment status
    let updatedStatus = order.status;
    let paidAt = order.paidAt;

    if (paymentStatus.result.isFinal) {
      if (paymentStatus.result.paymentStatus === "paid" || paymentStatus.result.status === "paid") {
        updatedStatus = "paid";
        if (!paidAt) {
          paidAt = new Date();
        }
      } else if (paymentStatus.result.paymentStatus === "expired" || paymentStatus.result.status === "expired") {
        updatedStatus = "expired";
      } else if (paymentStatus.result.paymentStatus === "cancelled" || paymentStatus.result.status === "cancelled") {
        updatedStatus = "cancelled";
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: updatedStatus,
        paymentStatus: paymentStatus.result.paymentStatus,
        paidAt: paidAt,
      },
      include: {
        channelListing: {
          select: {
            id: true,
            title: true,
            featuredImage: true,
            listingId: true,
          },
        },
      },
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error: any) {
    console.error("Error checking payment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check payment status" },
      { status: 500 }
    );
  }
}

