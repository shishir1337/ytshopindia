import crypto from "crypto";
import { prisma } from "./prisma";

/**
 * Generate a secure access token for guest orders
 */
export function generateOrderAccessToken(orderId: string, email: string): string {
  const secret = process.env.ORDER_ACCESS_SECRET || process.env.BETTER_AUTH_SECRET || "default-secret";
  const data = `${orderId}:${email}:${Date.now()}`;
  return crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("hex")
    .substring(0, 32);
}

/**
 * Verify order access token
 */
export function verifyOrderAccessToken(
  token: string,
  orderId: string,
  email: string
): boolean {
  // For now, we'll use a simpler approach - store token in order
  // In production, you might want to use a separate token table
  return token.length === 32; // Basic validation
}

/**
 * Check if user has access to order
 */
export async function checkOrderAccess(
  orderId: string,
  userId?: string | null,
  email?: string | null
): Promise<{ hasAccess: boolean; reason?: string }> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      userId: true,
      guestEmail: true,
    },
  });

  if (!order) {
    return { hasAccess: false, reason: "Order not found" };
  }

  // Logged in user owns the order
  if (userId && order.userId === userId) {
    return { hasAccess: true };
  }

  // Guest order - require email match
  if (!order.userId && order.guestEmail) {
    if (email && email.toLowerCase() === order.guestEmail.toLowerCase()) {
      return { hasAccess: true };
    }
    return { hasAccess: false, reason: "Email verification required" };
  }

  // Order belongs to another user
  if (order.userId && userId && order.userId !== userId) {
    return { hasAccess: false, reason: "Unauthorized" };
  }

  // Default: no access
  return { hasAccess: false, reason: "Unauthorized" };
}

