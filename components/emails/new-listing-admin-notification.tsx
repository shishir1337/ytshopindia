import * as React from "react";

interface NewListingAdminNotificationProps {
  listingTitle: string;
  sellerName: string;
  sellerEmail: string;
  sellerWhatsapp: string;
  listingId: string;
  expectedPrice?: string | null;
  currency?: string;
  channelLink?: string | null;
  adminUrl?: string;
}

export function NewListingAdminNotification({
  listingTitle,
  sellerName,
  sellerEmail,
  sellerWhatsapp,
  listingId,
  expectedPrice,
  currency = "₹",
  channelLink,
  adminUrl = "http://localhost:3000/admin/listings",
}: NewListingAdminNotificationProps) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "24px" }}>
        <h1 style={{ color: "#111827", fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
          New Channel Listing Submitted
        </h1>
        
        <p style={{ color: "#374151", fontSize: "16px", lineHeight: "1.5", marginBottom: "24px" }}>
          A new YouTube channel listing has been submitted and requires your review.
        </p>

        <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "16px", marginBottom: "24px" }}>
          <h2 style={{ color: "#111827", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
            Listing Details
          </h2>
          
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#374151" }}>Title:</strong>
            <span style={{ color: "#6b7280", marginLeft: "8px" }}>{listingTitle}</span>
          </div>
          
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#374151" }}>Listing ID:</strong>
            <span style={{ color: "#6b7280", marginLeft: "8px" }}>{listingId}</span>
          </div>
          
          {expectedPrice && (
            <div style={{ marginBottom: "8px" }}>
              <strong style={{ color: "#374151" }}>Expected Price:</strong>
              <span style={{ color: "#6b7280", marginLeft: "8px" }}>{currency} {expectedPrice}</span>
            </div>
          )}
          
          {channelLink && (
            <div style={{ marginBottom: "8px" }}>
              <strong style={{ color: "#374151" }}>Channel Link:</strong>
              <a 
                href={channelLink} 
                style={{ color: "#2563eb", marginLeft: "8px", textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {channelLink}
              </a>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "16px", marginBottom: "24px" }}>
          <h2 style={{ color: "#111827", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
            Seller Information
          </h2>
          
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#374151" }}>Name:</strong>
            <span style={{ color: "#6b7280", marginLeft: "8px" }}>{sellerName}</span>
          </div>
          
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#374151" }}>Email:</strong>
            <span style={{ color: "#6b7280", marginLeft: "8px" }}>{sellerEmail}</span>
          </div>
          
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#374151" }}>WhatsApp:</strong>
            <span style={{ color: "#6b7280", marginLeft: "8px" }}>{sellerWhatsapp}</span>
          </div>
        </div>

        <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "16px" }}>
            Please review this listing in the admin dashboard and approve or reject it accordingly.
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
            Review Listing
          </a>
        </div>
      </div>
    </div>
  );
}

