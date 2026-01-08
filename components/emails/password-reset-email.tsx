import * as React from "react";

interface PasswordResetEmailProps {
  resetUrl: string;
  userName: string;
}

export function PasswordResetEmail({
  resetUrl,
  userName,
}: PasswordResetEmailProps) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "24px" }}>
        <h1 style={{ color: "#111827", fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
          Reset Your Password
        </h1>
        
        <p style={{ color: "#4b5563", fontSize: "16px", lineHeight: "24px", marginBottom: "16px" }}>
          Hello {userName || "there"},
        </p>
        
        <p style={{ color: "#4b5563", fontSize: "16px", lineHeight: "24px", marginBottom: "24px" }}>
          We received a request to reset your password for your YT Shop India account. Click the button below to reset your password. This link will expire in 1 hour.
        </p>
        
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <a
            href={resetUrl}
            style={{
              display: "inline-block",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            Reset Password
          </a>
        </div>
        
        <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "20px", marginBottom: "16px" }}>
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        
        <p style={{ color: "#2563eb", fontSize: "14px", lineHeight: "20px", wordBreak: "break-all", marginBottom: "24px" }}>
          {resetUrl}
        </p>
        
        <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "20px", marginBottom: "8px" }}>
          If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </p>
        
        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "24px 0" }} />
        
        <p style={{ color: "#9ca3af", fontSize: "12px", lineHeight: "16px", margin: "0" }}>
          This is an automated email from YT Shop India. Please do not reply to this email.
        </p>
      </div>
    </div>
  );
}

