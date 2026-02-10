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
    let isAdmin = false;
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      userId = session?.user?.id || null;
      isAdmin = session?.user?.role === "admin";
    } catch (error) {
      // Not logged in
    }

    // Admins can view any order
    if (!isAdmin) {
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
    }

    // Get payment status from Cryptomus
    const paymentStatus = await getCryptomusPaymentStatus(order.cryptomusOrderId);

    // Update order based on payment status
    let updatedStatus = order.status;
    let paidAt = order.paidAt;
    const cryptomusStatus =
      paymentStatus.result.payment_status || paymentStatus.result.status;

    if (paymentStatus.result.is_final) {
      if (cryptomusStatus === "paid" || cryptomusStatus === "paid_over") {
        updatedStatus = "paid";
        if (!paidAt) {
          paidAt = new Date();
        }
      } else if (cryptomusStatus === "expired") {
        updatedStatus = "expired";
      } else if (cryptomusStatus === "cancelled" || cryptomusStatus === "cancel") {
        updatedStatus = "cancelled";
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: updatedStatus,
        paymentStatus: cryptomusStatus,
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

