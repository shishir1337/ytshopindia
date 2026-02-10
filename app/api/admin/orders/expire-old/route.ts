import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// POST - Expire old pending orders that have passed their expiration time
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const gracePeriodMinutes = 30; // 30 minutes grace period after Cryptomus expiration
    const gracePeriodMs = gracePeriodMinutes * 60 * 1000;
    const oneAndHalfHoursAgo = new Date(now.getTime() - 90 * 60 * 1000); // 1.5 hours ago (fallback for orders without expiresAt)

    // Find all expired pending GUEST orders only (spammers typically don't register)
    // Logic: 
    // 1. If expiresAt exists: expire at expiresAt + 30 minutes (Cryptomus expires at 60min, we expire at 90min)
    // 2. If expiresAt is null: expire at createdAt + 90 minutes (fallback)
    // This gives customers 30 minutes grace period after Cryptomus payment link expires
    const expiredOrders = await prisma.order.findMany({
      where: {
        userId: null,
        status: "pending",
        OR: [
          {
            // Orders with expiresAt: expire after grace period (expiresAt + 30 minutes)
            expiresAt: {
              not: null,
              lt: new Date(now.getTime() - gracePeriodMs), // expiresAt was more than 30 minutes ago
            },
          },
          {
            // Orders without expiresAt: expire after 90 minutes from creation (fallback)
            expiresAt: null,
            createdAt: {
              lt: oneAndHalfHoursAgo,
            },
          },
        ],
      },
      select: {
        id: true,
        channelListingId: true,
      },
    });

    if (expiredOrders.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No expired orders to update",
        expiredCount: 0,
      });
    }

    // Update all expired orders to "expired" status
    const result = await prisma.order.updateMany({
      where: {
        id: {
          in: expiredOrders.map((o) => o.id),
        },
      },
      data: {
        status: "expired",
        paymentStatus: "expired",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Expired ${result.count} order(s)`,
      expiredCount: result.count,
    });
  } catch (error: any) {
    console.error("Error expiring old orders:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

