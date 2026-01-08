import * as React from "react";

interface OrderPaymentAdminNotificationProps {
  orderId: string;
  channelTitle: string;
  amount: string;
  currency: string;
  customerName: string;
  customerEmail: string;
  isGuest: boolean;
  adminUrl?: string;
}

export function OrderPaymentAdminNotification({
  orderId,
  channelTitle,
  amount,
  currency,
  customerName,
  customerEmail,
  isGuest,
  adminUrl = "http://localhost:3000/admin/orders",
}: OrderPaymentAdminNotificationProps) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "24px" }}>
        <h1 style={{ color: "#111827", fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
          🎉 New Order Payment Received
        </h1>
        
        <p style={{ color: "#374151", fontSize: "16px", lineHeight: "1.5", marginBottom: "24px" }}>
          A customer has successfully completed payment for a channel purchase. Please proceed with the delivery process.
        </p>

        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac", borderRadius: "6px", padding: "16px", marginBottom: "24px" }}>
          <h2 style={{ color: "#166534", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
            ✅ Payment Confirmed
          </h2>
          <p style={{ color: "#166534", fontSize: "14px", margin: "0" }}>
            The payment has been successfully processed and the order is ready for delivery.
          </p>
        </div>

        <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "16px", marginBottom: "24px" }}>
          <h2 style={{ color: "#111827", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
            Order Details
          </h2>
          
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#374151" }}>Order ID:</strong>
            <span style={{ color: "#6b7280", marginLeft: "8px", fontFamily: "monospace" }}>{orderId}</span>
          </div>
          
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#374151" }}>Channel:</strong>
            <span style={{ color: "#6b7280", marginLeft: "8px" }}>{channelTitle}</span>
          </div>
          
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#374151" }}>Amount Paid:</strong>
            <span style={{ color: "#059669", marginLeft: "8px", fontWeight: "600" }}>{currency} {amount}</span>
          </div>
        </div>

        <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "16px", marginBottom: "24px" }}>
          <h2 style={{ color: "#111827", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
            Customer Information
          </h2>
          
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#374151" }}>Name:</strong>
            <span style={{ color: "#6b7280", marginLeft: "8px" }}>{customerName}</span>
          </div>
          
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#374151" }}>Email:</strong>
            <span style={{ color: "#6b7280", marginLeft: "8px" }}>{customerEmail}</span>
          </div>
          
          {isGuest && (
            <div style={{ marginTop: "8px", padding: "8px", backgroundColor: "#fef3c7", borderRadius: "4px" }}>
              <span style={{ color: "#92400e", fontSize: "12px" }}>⚠️ Guest Order - No user account</span>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", padding: "16px", marginBottom: "24px" }}>
          <h2 style={{ color: "#1e40af", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
            Next Steps
          </h2>
          <ol style={{ color: "#1e40af", fontSize: "14px", lineHeight: "1.8", margin: "0", paddingLeft: "20px" }}>
            <li>Coordinate with the seller to obtain channel access credentials</li>
            <li>Prepare delivery details (login information, transfer instructions, etc.)</li>
            <li>Mark the order as delivered in the admin dashboard</li>
            <li>The customer will receive an email with delivery details automatically</li>
          </ol>
        </div>

        <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "16px" }}>
            Please process this order and mark it as delivered once you have the access details ready.
          </p>
          <a
            href={adminUrl}
            style={{
              display: "inline-block",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "600",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Order in Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

