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
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago (matches Cryptomus invoice lifetime)

    // Find all expired pending GUEST orders only (spammers typically don't register)
    const expiredOrders = await prisma.order.findMany({
      where: {
        userId: null,
        status: "pending",
        OR: [
          {
            expiresAt: {
              lt: now, // Less than current time = expired
            },
          },
          {
            expiresAt: null,
            createdAt: {
              lt: oneHourAgo, // Older than 1 hour without expiration date (matches invoice lifetime)
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

