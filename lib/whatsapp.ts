/**
 * WhatsApp notification utility
 * 
 * This function formats and sends WhatsApp notifications.
 * Currently logs the message. To actually send WhatsApp messages, integrate with:
 * - Twilio WhatsApp API (recommended)
 * - WhatsApp Business API
 * - Other WhatsApp messaging services
 */

const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP || "+919101782780";

interface WhatsAppNotificationData {
  sellerName: string;
  sellerWhatsapp: string;
  channelLink: string | null;
  monetizationStatus: string;
  sellerEmail: string;
  expectedPrice: string | null;
  currency?: string;
}

export async function sendWhatsAppNotification(
  data: WhatsAppNotificationData
) {
  try {
    // Format the message as requested
    const message = `Name: ${data.sellerName}, Whatsapp Number: ${data.sellerWhatsapp}, Channel Link: ${data.channelLink || "N/A"}, Monetization Status: ${data.monetizationStatus}, Your Email: ${data.sellerEmail}, Expected price: ${data.expectedPrice || "N/A"} ${data.currency || "₹"}`;

    // Clean phone number (remove + and spaces)
    const cleanPhoneNumber = ADMIN_WHATSAPP.replace(/[^0-9]/g, "");

    // Create WhatsApp URL (opens WhatsApp Web/App with pre-filled message)
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(message)}`;

    console.log("WhatsApp notification:");
    console.log("To:", ADMIN_WHATSAPP);
    console.log("Message:", message);
    console.log("WhatsApp URL:", whatsappUrl);

    // TODO: Integrate with actual WhatsApp API service
    // Example with Twilio WhatsApp API:
    // const accountSid = process.env.TWILIO_ACCOUNT_SID;
    // const authToken = process.env.TWILIO_AUTH_TOKEN;
    // const client = require('twilio')(accountSid, authToken);
    // 
    // await client.messages.create({
    //   from: 'whatsapp:+14155238886', // Twilio WhatsApp number
    //   to: `whatsapp:${ADMIN_WHATSAPP}`,
    //   body: message
    // });

    // For now, return success with the formatted message and URL
    // You can use this URL to manually send, or integrate with a WhatsApp API
    return {
      success: true,
      message,
      url: whatsappUrl,
      to: ADMIN_WHATSAPP
    };
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error);
    return { success: false, error };
  }
}
