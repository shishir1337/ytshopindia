import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCryptomusWebhook } from "@/lib/cryptomus";
import { sendOrderConfirmationEmail, sendOrderCompletedEmail, sendOrderPaymentAdminNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("sign") || "";

    // Verify webhook signature
    if (!verifyCryptomusWebhook(body, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const data = JSON.parse(body);
    const { order_id, payment_status, status } = data;

    if (!order_id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Find order by Cryptomus order ID
    const order = await prisma.order.findUnique({
      where: { cryptomusOrderId: order_id },
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
      console.error(`Order not found for Cryptomus order ID: ${order_id}`);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update order status based on payment status
    let updatedStatus = order.status;
    let paidAt = order.paidAt;

    if (payment_status === "paid" || status === "paid") {
      updatedStatus = "paid";
      if (!paidAt) {
        paidAt = new Date();
      }

      // Send confirmation emails
      const customerEmail = order.user?.email || order.guestEmail;
      const customerName = order.user?.name || order.guestName || "Customer";

      if (customerEmail) {
        // Send order confirmation email
        await sendOrderConfirmationEmail({
          to: customerEmail,
          orderId: order.id,
          channelTitle: order.channelListing.title,
          amount: order.amount,
          currency: order.currency,
          customerName,
        });

        // Send order completed email (payment confirmed)
        await sendOrderCompletedEmail({
          to: customerEmail,
          orderId: order.id,
          channelTitle: order.channelListing.title,
          customerName,
        });
      }

      // Send admin notification email (non-blocking)
      await sendOrderPaymentAdminNotification({
        orderId: order.id,
        channelTitle: order.channelListing.title,
        amount: order.amount,
        currency: order.currency,
        customerName,
        customerEmail: customerEmail || "N/A",
        isGuest: !order.userId,
      }).catch((error) => {
        console.error("Failed to send admin order payment notification:", error);
        // Don't fail the request if email fails
      });
    } else if (payment_status === "expired" || status === "expired") {
      updatedStatus = "expired";
    } else if (payment_status === "cancelled" || status === "cancelled") {
      updatedStatus = "cancelled";
    }

    // Update order
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: updatedStatus,
        paymentStatus: payment_status || status,
        paidAt: paidAt,
      },
    });

    // If payment is confirmed, mark channel as sold
    if (updatedStatus === "paid") {
      await prisma.channelListing.update({
        where: { id: order.channelListingId },
        data: {
          status: "sold",
        },
      });
    }

    return NextResponse.json({ success: true, status: updatedStatus });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Allow GET for webhook verification (if needed by Cryptomus)
export async function GET(request: NextRequest) {
  // Return minimal response to avoid information disclosure
  return NextResponse.json({ status: "ok" }, { status: 200 });
}

