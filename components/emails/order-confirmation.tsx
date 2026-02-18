import * as React from "react";

interface OrderConfirmationEmailProps {
  orderId: string;
  orderNumber?: number | null;
  channelTitle: string;
  amount: string;
  currency: string;
  customerName: string;
}

export function OrderConfirmationEmail({
  orderId,
  orderNumber,
  channelTitle,
  amount,
  currency,
  customerName,
}: OrderConfirmationEmailProps) {
  const orderDisplay = orderNumber != null ? `#${orderNumber}` : orderId;
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "24px" }}>
        <h1 style={{ color: "#111827", fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
          Order Confirmed
        </h1>
        
        <p style={{ color: "#4b5563", fontSize: "16px", lineHeight: "24px", marginBottom: "16px" }}>
          Hello {customerName || "there"},
        </p>
        
        <p style={{ color: "#4b5563", fontSize: "16px", lineHeight: "24px", marginBottom: "24px" }}>
          Thank you for your order! We&apos;ve received your order and are processing your payment.
        </p>
        
        <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "16px", marginBottom: "24px" }}>
          <h2 style={{ color: "#111827", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
            Order Details
          </h2>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#6b7280", fontSize: "14px" }}>Order ID:</span>
              <span style={{ color: "#111827", fontSize: "14px", fontWeight: "600" }}>{orderDisplay}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#6b7280", fontSize: "14px" }}>Channel:</span>
              <span style={{ color: "#111827", fontSize: "14px", fontWeight: "600" }}>{channelTitle}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#6b7280", fontSize: "14px" }}>Amount:</span>
              <span style={{ color: "#111827", fontSize: "14px", fontWeight: "600" }}>{currency} {amount}</span>
            </div>
          </div>
        </div>
        
        <p style={{ color: "#4b5563", fontSize: "16px", lineHeight: "24px", marginBottom: "16px" }}>
            Please complete the payment using the instructions provided on the payment page. Once your payment is confirmed, we&apos;ll begin processing your order.
        </p>
        
        <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
          <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "20px", margin: "0" }}>
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}

