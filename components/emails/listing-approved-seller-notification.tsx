import * as React from "react";

interface ListingApprovedSellerNotificationProps {
  listingTitle: string;
  sellerName: string;
  listingId: string;
  listingUrl: string;
}

export function ListingApprovedSellerNotification({
  listingTitle,
  sellerName,
  listingId,
  listingUrl,
}: ListingApprovedSellerNotificationProps) {

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ 
            width: "64px", 
            height: "64px", 
            backgroundColor: "#10b981", 
            borderRadius: "50%", 
            display: "inline-flex", 
            alignItems: "center", 
            justifyContent: "center",
            marginBottom: "16px"
          }}>
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>

        <h1 style={{ color: "#111827", fontSize: "24px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
          Your Listing is Now Live! 🎉
        </h1>
        
        <p style={{ color: "#374151", fontSize: "16px", lineHeight: "1.5", marginBottom: "24px" }}>
          Hi {sellerName},
        </p>

        <p style={{ color: "#374151", fontSize: "16px", lineHeight: "1.5", marginBottom: "24px" }}>
          Great news! Your YouTube channel listing <strong>"{listingTitle}"</strong> has been reviewed and approved by our team. Your listing is now live and visible to potential buyers!
        </p>

        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac", borderRadius: "6px", padding: "16px", marginBottom: "24px" }}>
          <h2 style={{ color: "#111827", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
            Listing Information
          </h2>
          
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#374151" }}>Title:</strong>
            <span style={{ color: "#6b7280", marginLeft: "8px" }}>{listingTitle}</span>
          </div>
          
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#374151" }}>Listing ID:</strong>
            <span style={{ color: "#6b7280", marginLeft: "8px" }}>{listingId}</span>
          </div>
        </div>

        <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e5e7eb", textAlign: "center" }}>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "16px" }}>
            View your live listing:
          </p>
          <a
            href={listingUrl}
            style={{
              display: "inline-block",
              backgroundColor: "#10b981",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "600",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Listing
          </a>
        </div>

        <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
          <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
            Thank you for choosing our platform. If you have any questions or need assistance, please don't hesitate to contact us.
          </p>
        </div>
      </div>
    </div>
  );
}

