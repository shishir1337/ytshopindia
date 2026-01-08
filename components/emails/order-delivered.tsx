import * as React from "react";

interface OrderDeliveredEmailProps {
  orderId: string;
  channelTitle: string;
  deliveryDetails: string;
  customerName: string;
}

export function OrderDeliveredEmail({
  orderId,
  channelTitle,
  deliveryDetails,
  customerName,
}: OrderDeliveredEmailProps) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "24px" }}>
        <h1 style={{ color: "#111827", fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
          Your Order Has Been Delivered! 🎉
        </h1>
        
        <p style={{ color: "#4b5563", fontSize: "16px", lineHeight: "24px", marginBottom: "16px" }}>
          Hello {customerName || "there"},
        </p>
        
        <p style={{ color: "#4b5563", fontSize: "16px", lineHeight: "24px", marginBottom: "24px" }}>
          Great news! Your order has been processed and delivered. Below are the access details for your purchased channel.
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
        
        <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "16px", marginBottom: "24px" }}>
          <h2 style={{ color: "#111827", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
            Delivery Information
          </h2>
          <div style={{ 
            backgroundColor: "#ffffff", 
            border: "1px solid #d1d5db", 
            borderRadius: "4px", 
            padding: "12px",
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            fontSize: "14px",
            lineHeight: "20px",
            color: "#111827"
          }}>
            {deliveryDetails}
          </div>
        </div>
        
        <div style={{ backgroundColor: "#fef3c7", border: "1px solid #fcd34d", borderRadius: "6px", padding: "12px", marginBottom: "24px" }}>
          <p style={{ color: "#92400e", fontSize: "14px", lineHeight: "20px", margin: "0" }}>
            <strong>Important:</strong> Please save this information securely. If you have any questions or need assistance, please contact our support team.
          </p>
        </div>
        
        <p style={{ color: "#4b5563", fontSize: "16px", lineHeight: "24px", marginBottom: "24px" }}>
          Thank you for choosing YT Shop India! We hope you enjoy your new channel.
        </p>
        
        <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
          <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "20px", margin: "0" }}>
            If you have any questions or concerns, please don't hesitate to reach out to our support team.
          </p>
        </div>
      </div>
    </div>
  );
}

