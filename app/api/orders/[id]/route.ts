import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkOrderAccess } from "@/lib/order-access";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email"); // For guest order verification
    
    const order = await prisma.order.findUnique({
      where: { id },
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

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
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
      const accessCheck = await checkOrderAccess(id, userId, email || null);
      
      if (!accessCheck.hasAccess) {
        // For guest orders, return a more specific error
        if (!order.userId && order.guestEmail) {
          return NextResponse.json(
            { 
              error: "Email verification required",
              requiresEmail: true,
              message: "Please provide the email address used for this order"
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

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

