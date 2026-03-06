import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyCryptomusWebhook } from "@/lib/cryptomus";
import { sendOrderConfirmationEmail, sendOrderCompletedEmail, sendOrderPaymentAdminNotification } from "@/lib/email";
import { sendOrderPaidWhatsAppNotification } from "@/lib/twilio-whatsapp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Verify webhook signature (sign is in body per Cryptomus docs)
    if (!verifyCryptomusWebhook(body)) {
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

    // Update order status based on payment status; never overwrite delivered/completed
    const alreadyDeliveredOrCompleted =
      order.status === "delivered" || order.status === "completed";

    let updatedStatus = order.status;
    let paidAt = order.paidAt;

    const cryptomusStatus = payment_status || status;
    const isPaid =
      cryptomusStatus === "paid" || cryptomusStatus === "paid_over";

    if (alreadyDeliveredOrCompleted) {
      // Leave status unchanged; do not send emails or mark sold again
      updatedStatus = order.status;
    } else if (isPaid) {
      updatedStatus = "paid";
      if (!paidAt) {
        paidAt = new Date();
      }

      // Send confirmation emails only when transitioning to paid (not when already delivered)
      const customerEmail = order.user?.email || order.guestEmail;
      const customerName = order.user?.name || order.guestName || "Customer";

      if (customerEmail) {
        await sendOrderConfirmationEmail({
          to: customerEmail,
          orderId: order.id,
          orderNumber: order.orderNumber,
          channelTitle: order.channelListing.title,
          amount: order.amount,
          currency: order.currency,
          customerName,
        });

        await sendOrderCompletedEmail({
          to: customerEmail,
          orderId: order.id,
          orderNumber: order.orderNumber,
          channelTitle: order.channelListing.title,
          customerName,
        });
      }

      await sendOrderPaymentAdminNotification({
        orderId: order.id,
        orderNumber: order.orderNumber,
        channelTitle: order.channelListing.title,
        amount: order.amount,
        currency: order.currency,
        customerName,
        customerEmail: customerEmail || "N/A",
        isGuest: !order.userId,
      }).catch((error) => {
        console.error("Failed to send admin order payment notification:", error);
      });

      await sendOrderPaidWhatsAppNotification({
        orderId: order.id,
        orderNumber: order.orderNumber ?? null,
        channelTitle: order.channelListing.title,
        amount: order.amount,
        currency: order.currency,
        customerName,
        customerEmail: customerEmail || "N/A",
      }).catch((error) => {
        console.error("Failed to send WhatsApp order notification:", error);
      });
    } else if (cryptomusStatus === "expired") {
      updatedStatus = "expired";
    } else if (cryptomusStatus === "cancelled" || cryptomusStatus === "cancel") {
      updatedStatus = "cancelled";
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: updatedStatus,
        paymentStatus: cryptomusStatus,
        paidAt: paidAt,
      },
    });

    if (updatedStatus === "paid" && !alreadyDeliveredOrCompleted) {
      await prisma.channelListing.update({
        where: { id: order.channelListingId },
        data: { status: "sold" },
      });
      // Invalidate cache so sold channel disappears from home & buy-channel listings immediately
      revalidatePath("/");
      revalidatePath("/buy-channel");
      revalidatePath(`/buy-channel/${order.channelListingId}`);
    }

    return NextResponse.json({ success: true, status: updatedStatus });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Allow GET for webhook verification (if needed by Cryptomus)
export async function GET() {
  // Return minimal response to avoid information disclosure
  return NextResponse.json({ status: "ok" }, { status: 200 });
}

