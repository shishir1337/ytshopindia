import * as React from "react";

interface OrderCompletedEmailProps {
  orderId: string;
  channelTitle: string;
  customerName: string;
}

export function OrderCompletedEmail({
  orderId,
  channelTitle,
  customerName,
}: OrderCompletedEmailProps) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "24px" }}>
        <h1 style={{ color: "#111827", fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
          Payment Confirmed! 🎉
        </h1>
        
        <p style={{ color: "#4b5563", fontSize: "16px", lineHeight: "24px", marginBottom: "16px" }}>
          Hello {customerName || "there"},
        </p>
        
        <p style={{ color: "#4b5563", fontSize: "16px", lineHeight: "24px", marginBottom: "24px" }}>
          Great news! Your payment has been confirmed for your order. We're now processing your channel transfer.
        </p>
        
        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac", borderRadius: "6px", padding: "16px", marginBottom: "24px" }}>
          <h2 style={{ color: "#166534", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
            Order Details
          </h2>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#166534", fontSize: "14px" }}>Order ID:</span>
              <span style={{ color: "#166534", fontSize: "14px", fontWeight: "600" }}>{orderId}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#166534", fontSize: "14px" }}>Channel:</span>
              <span style={{ color: "#166534", fontSize: "14px", fontWeight: "600" }}>{channelTitle}</span>
            </div>
          </div>
        </div>
        
        <p style={{ color: "#4b5563", fontSize: "16px", lineHeight: "24px", marginBottom: "16px" }}>
          Our team is now preparing to transfer the channel to you. You'll receive another email with delivery details and access information once everything is ready.
        </p>
        
        <p style={{ color: "#4b5563", fontSize: "16px", lineHeight: "24px", marginBottom: "24px" }}>
          This process typically takes 24-48 hours. If you have any questions, please don't hesitate to contact our support team.
        </p>
        
        <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
          <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "20px", margin: "0" }}>
            Thank you for choosing YT Shop India!
          </p>
        </div>
      </div>
    </div>
  );
}

