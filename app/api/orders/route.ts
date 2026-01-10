import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createCryptomusInvoice, formatAmountForCryptomus } from "@/lib/cryptomus";
import { convertInrToUsd } from "@/lib/exchange-rate";
import { createOrderSchema, validateEmail } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = createOrderSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { listingId, channelAccessEmail, guestEmail, guestName } = validationResult.data;

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Validate channelAccessEmail
    const channelAccessEmailValidation = validateEmail(channelAccessEmail);
    if (!channelAccessEmailValidation.valid) {
      return NextResponse.json(
        { error: channelAccessEmailValidation.error || "Invalid channel access email" },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (guestEmail) {
      const emailValidation = validateEmail(guestEmail);
      if (!emailValidation.valid) {
        return NextResponse.json(
          { error: emailValidation.error },
          { status: 400 }
        );
      }
    }

    // Get listing
    const listing = await prisma.channelListing.findUnique({
      where: { id: listingId },
    });

    if (!listing || listing.status !== "approved") {
      return NextResponse.json(
        { error: "Listing not found or not available" },
        { status: 404 }
      );
    }

    // Check if listing is already sold (check for existing paid orders)
    const existingPaidOrder = await prisma.order.findFirst({
      where: {
        channelListingId: listing.id,
        status: {
          in: ["paid", "delivered", "completed"],
        },
      },
    });

    if (existingPaidOrder) {
      return NextResponse.json(
        { error: "This channel has already been sold" },
        { status: 400 }
      );
    }

    // Get user session (optional - for logged in users)
    let userId: string | null = null;
    let userEmail: string | null = null;
    let userName: string | null = null;

    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (session?.user) {
        userId = session.user.id;
        userEmail = session.user.email;
        userName = session.user.name || null;
      }
    } catch (error) {
      // User not logged in, continue as guest
    }

    // For guest users, email is required
    if (!userId && !guestEmail) {
      return NextResponse.json(
        { error: "Email is required for guest checkout" },
        { status: 400 }
      );
    }

    // Determine email to use
    const orderEmail = userEmail || guestEmail!;
    const orderName = userName || guestName || "Guest";

    // Convert price to USD
    if (!listing.expectedPrice) {
      return NextResponse.json(
        { error: "Listing price is not available" },
        { status: 400 }
      );
    }

    const originalPrice = listing.expectedPrice;
    const originalCurrency = listing.currency || "₹";
    const usdAmount = await convertInrToUsd(originalPrice);
    const formattedAmount = formatAmountForCryptomus(usdAmount);

    // Get exchange rate for storage
    const { getUsdToInrRate } = await import("@/lib/exchange-rate");
    const exchangeRate = await getUsdToInrRate();

    // Create order in database
    const order = await prisma.order.create({
      data: {
        channelListingId: listing.id,
        userId: userId || null,
        guestEmail: userId ? null : guestEmail,
        guestName: userId ? null : orderName,
        channelAccessEmail,
        originalPrice,
        originalCurrency,
        amount: formattedAmount,
        currency: "USD",
        exchangeRate,
        status: "pending",
      },
    });

    // Create Cryptomus invoice
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const cryptomusResponse = await createCryptomusInvoice({
      amount: formattedAmount,
      currency: "USD",
      orderId: order.id,
      urlReturn: `${baseUrl}/payment/${order.id}`,
      urlSuccess: `${baseUrl}/payment/${order.id}?status=success`,
      urlCallback: `${baseUrl}/api/webhooks/cryptomus`,
      lifetime: 60, // 60 minutes
    });

    // Update order with Cryptomus details
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        cryptomusInvoiceId: cryptomusResponse.result.uuid,
        cryptomusOrderId: cryptomusResponse.result.order_id,
        cryptomusPaymentUrl: cryptomusResponse.result.url,
        paymentNetwork: cryptomusResponse.result.network,
        paymentAddress: cryptomusResponse.result.address,
        paymentAmount: cryptomusResponse.result.payment_amount,
        paymentStatus: cryptomusResponse.result.payment_status,
        expiresAt: cryptomusResponse.result.expired_at ? new Date(cryptomusResponse.result.expired_at * 1000) : null,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        paymentUrl: cryptomusResponse.result.url,
        amount: formattedAmount,
        currency: "USD",
        paymentAddress: cryptomusResponse.result.address,
        paymentNetwork: cryptomusResponse.result.network,
        paymentAmount: cryptomusResponse.result.payment_amount,
        expiresAt: cryptomusResponse.result.expired_at,
      },
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user orders
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

