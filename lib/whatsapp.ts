import { prisma } from "./prisma";

const ADMIN_WHATSAPP_FALLBACK = process.env.ADMIN_WHATSAPP || "+919101782780";

/**
 * Gets the admin WhatsApp number from the database with an environment/static fallback.
 */
export async function getAdminWhatsapp() {
  try {
    const settings = await prisma.siteSetting.findUnique({
      where: { id: "singleton" },
    });
    return settings?.adminWhatsapp || ADMIN_WHATSAPP_FALLBACK;
  } catch (error) {
    return ADMIN_WHATSAPP_FALLBACK;
  }
}

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
    const adminNumber = await getAdminWhatsapp();
    // Format the message as requested
    const message = `Name: ${data.sellerName}, Whatsapp Number: ${data.sellerWhatsapp}, Channel Link: ${data.channelLink || "N/A"}, Monetization Status: ${data.monetizationStatus}, Your Email: ${data.sellerEmail}, Expected price: ${data.expectedPrice || "N/A"} ${data.currency || "₹"}`;

    // Clean phone number (remove + and spaces)
    const cleanPhoneNumber = adminNumber.replace(/[^0-9]/g, "");

    // Create WhatsApp URL (opens WhatsApp Web/App with pre-filled message)
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(message)}`;

    console.log("WhatsApp notification:");
    console.log("To:", adminNumber);
    console.log("Message:", message);
    console.log("WhatsApp URL:", whatsappUrl);

    return {
      success: true,
      message,
      url: whatsappUrl,
      to: adminNumber
    };
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error);
    return { success: false, error };
  }
}
