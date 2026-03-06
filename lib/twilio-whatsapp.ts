import twilio from "twilio";

/**
 * Twilio WhatsApp – Order paid notifications
 *
 * Required env vars:
 *   TWILIO_ACCOUNT_SID  - From Twilio Console
 *   TWILIO_AUTH_TOKEN   - From Twilio Console
 *
 * Optional:
 *   TWILIO_WHATSAPP_FROM   - Sender (default: whatsapp:+14155238886 sandbox)
 *   TWILIO_WHATSAPP_ADMIN  - Recipient (default: +919101782780)
 *   TWILIO_WHATSAPP_CONTENT_SID - Content template SID (for production; sandbox may use body)
 */
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";
const adminWhatsapp = process.env.TWILIO_WHATSAPP_ADMIN || "+919101782780";
const contentSid = process.env.TWILIO_WHATSAPP_CONTENT_SID;

/**
 * Send WhatsApp notification when a customer pays for an order.
 * Uses Twilio WhatsApp API. For business-initiated messages, a pre-approved
 * Content Template is required (create in Twilio Console).
 */
export async function sendOrderPaidWhatsAppNotification(data: {
  orderNumber: number | null;
  orderId: string;
  channelTitle: string;
  amount: string;
  currency: string;
  customerName: string;
  customerEmail: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!accountSid || !authToken) {
    console.warn("Twilio credentials not configured. Skipping WhatsApp notification.");
    return { success: true };
  }

  try {
    const client = twilio(accountSid, authToken);
    const to = adminWhatsapp.startsWith("whatsapp:") ? adminWhatsapp : `whatsapp:${adminWhatsapp}`;
    const from = fromNumber.startsWith("whatsapp:") ? fromNumber : `whatsapp:${fromNumber}`;

    if (contentSid) {
      // Use Content Template (required for business-initiated WhatsApp)
      const contentVariables = JSON.stringify({
        "1": `#${data.orderNumber ?? data.orderId.slice(-8)}`,
        "2": data.channelTitle,
        "3": `${data.currency} ${data.amount}`,
        "4": data.customerName,
        "5": data.customerEmail,
      });

      await client.messages.create({
        from,
        to,
        contentSid,
        contentVariables,
      });
    } else {
      // Fallback: plain text (may work in sandbox; production usually needs template)
      const body = [
        "🛒 New order paid – deliver ASAP",
        "",
        `Order: #${data.orderNumber ?? data.orderId.slice(-8)}`,
        `Channel: ${data.channelTitle}`,
        `Amount: ${data.currency} ${data.amount}`,
        `Customer: ${data.customerName} (${data.customerEmail})`,
      ].join("\n");

      await client.messages.create({
        from,
        to,
        body,
      });
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Twilio WhatsApp notification failed:", error);
    return { success: false, error: message };
  }
}
