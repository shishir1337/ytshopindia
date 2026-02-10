import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrdersTable } from "./components/orders-table";

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "admin") {
    redirect("/admin-login");
  }

  // Auto-expire old pending orders on page load
  const now = new Date();
  const gracePeriodMinutes = 30; // 30 minutes grace period after Cryptomus expiration
  const gracePeriodMs = gracePeriodMinutes * 60 * 1000;
  const oneAndHalfHoursAgo = new Date(now.getTime() - 90 * 60 * 1000); // 1.5 hours ago (fallback for orders without expiresAt)
  
  // Expire only GUEST orders (spammers typically don't register) - registered users' orders stay pending
  // Logic: 
  // 1. If expiresAt exists: expire at expiresAt + 30 minutes (Cryptomus expires at 60min, we expire at 90min)
  // 2. If expiresAt is null: expire at createdAt + 90 minutes (fallback)
  // This gives customers 30 minutes grace period after Cryptomus payment link expires
  await prisma.order.updateMany({
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
    data: {
      status: "expired",
      paymentStatus: "expired",
    },
  });

  // Fetch all orders with related data
  const orders = await prisma.order.findMany({
    include: {
      channelListing: {
        select: {
          id: true,
          title: true,
          featuredImage: true,
          listingId: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get order statistics
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => o.status === "paid").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    completed: orders.filter((o) => o.status === "completed").length,
    expired: orders.filter((o) => o.status === "expired").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
        <p className="text-muted-foreground">
          View and manage all customer orders
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Orders</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">Pending Payment</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.paid}</div>
          <div className="text-sm text-muted-foreground">Paid</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold text-purple-600">{stats.delivered}</div>
          <div className="text-sm text-muted-foreground">Delivered</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold text-gray-600">{stats.expired}</div>
          <div className="text-sm text-muted-foreground">Expired</div>
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable orders={orders} />
    </div>
  );
}

