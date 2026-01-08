"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Simple Dialog component (inline for now)
function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative z-50">{children}</div>
    </div>
  );
}

function DialogContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-background rounded-lg border shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${className}`}>
      {children}
    </div>
  );
}

function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold mb-2">{children}</h2>;
}

function DialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-end gap-2 mt-4">{children}</div>;
}
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Package, Mail, User, Calendar, DollarSign, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
// Format date helper
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

interface Order {
  id: string;
  status: string;
  paymentStatus: string | null;
  amount: string;
  currency: string;
  originalPrice: string;
  originalCurrency: string;
  guestEmail: string | null;
  guestName: string | null;
  deliveredAt: Date | null;
  deliveryDetails: string | null;
  deliveryNotes: string | null;
  createdAt: Date;
  paidAt: Date | null;
  channelListing: {
    id: string;
    title: string;
    featuredImage: string | null;
    listingId: string | null;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders: initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>("active"); // Default to "active" to hide expired
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [expiring, setExpiring] = useState(false);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // "active" filter excludes expired and cancelled orders
    let matchesStatus = true;
    if (statusFilter === "active") {
      matchesStatus = !["expired", "cancelled"].includes(order.status);
    } else if (statusFilter === "all") {
      matchesStatus = true;
    } else {
      matchesStatus = order.status === statusFilter;
    }

    const matchesSearch =
      searchQuery === "" ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.channelListing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.email || order.guestEmail || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleMarkAsDelivered = async () => {
    if (!selectedOrder || !deliveryDetails.trim()) {
      toast.error("Please provide delivery details");
      return;
    }

    // Show confirmation dialog
    setIsConfirmDialogOpen(true);
  };

  const handleExpireOldOrders = async () => {
    setExpiring(true);
    try {
      const response = await fetch("/api/admin/orders/expire-old", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to expire old orders");
      }

      // Refresh the page to show updated orders
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to expire old orders");
    } finally {
      setExpiring(false);
    }
  };

  const confirmMarkAsDelivered = async () => {
    if (!selectedOrder || !deliveryDetails.trim()) {
      toast.error("Please provide delivery details");
      return;
    }

    setIsConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}/deliver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deliveryDetails,
          deliveryNotes: deliveryNotes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to mark as delivered");
      }

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status: "delivered",
                deliveredAt: new Date(),
                deliveryDetails,
                deliveryNotes: deliveryNotes || null,
              }
            : order
        )
      );

      toast.success("Order marked as delivered!");
      setIsDeliveryDialogOpen(false);
      setSelectedOrder(null);
      setDeliveryDetails("");
      setDeliveryNotes("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      paid: "default",
      delivered: "outline",
      completed: "default",
      cancelled: "destructive",
      expired: "destructive",
    };

    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      paid: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      delivered: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      completed: "bg-green-500/10 text-green-600 border-green-500/20",
      cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
      expired: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    };

    return (
      <Badge
        variant={variants[status] || "secondary"}
        className={colors[status] || ""}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <>
      <div className="rounded-lg border bg-card">
        {/* Filters */}
        <div className="flex flex-col gap-4 p-4 border-b sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExpireOldOrders}
              disabled={expiring}
              title="Expire old pending orders that have passed their expiration time"
            >
              {expiring ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Expiring...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 size-4" />
                  Expire Old Orders
                </>
              )}
            </Button>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active Orders</SelectItem>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {order.channelListing.featuredImage && (
                        <Image
                          src={order.channelListing.featuredImage}
                          alt={order.channelListing.title}
                          width={40}
                          height={40}
                          className="rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium text-sm">{order.channelListing.title}</div>
                        {order.channelListing.listingId && (
                          <div className="text-xs text-muted-foreground">
                            ID: {order.channelListing.listingId}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {order.user ? (
                        <>
                          <User className="size-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">{order.user.name || "User"}</div>
                            <div className="text-xs text-muted-foreground">{order.user.email}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <Mail className="size-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">{order.guestName || "Guest"}</div>
                            <div className="text-xs text-muted-foreground">{order.guestEmail}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {order.currency} {order.amount}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.originalCurrency} {order.originalPrice}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="size-3" />
                      {formatDate(order.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          window.open(`/payment/${order.id}`, "_blank");
                        }}
                        title="View Order Details"
                      >
                        <Eye className="size-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDeliveryDialogOpen(true);
                          setDeliveryDetails(order.deliveryDetails || "");
                          setDeliveryNotes(order.deliveryNotes || "");
                        }}
                        disabled={order.status !== "paid"}
                        title={order.status !== "paid" ? "Order must be paid first" : "Mark as Delivered"}
                      >
                        <Package className="size-4 mr-1" />
                        Deliver
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delivery Dialog */}
      <Dialog open={isDeliveryDialogOpen} onOpenChange={setIsDeliveryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mark Order as Delivered</DialogTitle>
            <DialogDescription>
              Add delivery details and access information for order #{selectedOrder?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryDetails">
                Delivery Details <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="deliveryDetails"
                placeholder="Enter access credentials, channel transfer details, login information, etc."
                value={deliveryDetails}
                onChange={(e) => setDeliveryDetails(e.target.value)}
                rows={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                This information will be sent to the customer via email
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryNotes">Internal Notes (Optional)</Label>
              <Textarea
                id="deliveryNotes"
                placeholder="Internal notes (not sent to customer)"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeliveryDialogOpen(false);
                setSelectedOrder(null);
                setDeliveryDetails("");
                setDeliveryNotes("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleMarkAsDelivered} disabled={loading || !deliveryDetails.trim()}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delivery</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark order #{selectedOrder?.id.slice(0, 8)} as delivered? 
              This will send an email to the customer with delivery details.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Channel: <strong>{selectedOrder?.channelListing.title}</strong>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Customer: <strong>{selectedOrder?.user?.email || selectedOrder?.guestEmail}</strong>
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmDialogOpen(false);
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={confirmMarkAsDelivered} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Yes, Mark as Delivered"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

