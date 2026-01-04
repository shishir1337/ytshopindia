import { Resend } from "resend";
import { render } from "@react-email/render";
import { NewListingAdminNotification } from "@/components/emails/new-listing-admin-notification";
import { ListingApprovedSellerNotification } from "@/components/emails/listing-approved-seller-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "support@nexusnestdigital.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "support@nexusnestdigital.com";

interface NewListingEmailData {
  listingTitle: string;
  sellerName: string;
  sellerEmail: string;
  sellerWhatsapp: string;
  listingId: string;
  expectedPrice?: string | null;
  currency?: string;
  channelLink?: string | null;
}

interface ListingApprovedEmailData {
  listingTitle: string;
  sellerName: string;
  sellerEmail: string;
  listingId: string;
  listingUrl: string;
}

export async function sendNewListingAdminNotification(
  data: NewListingEmailData
) {
  try {
    const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/listings`;
    
    const emailHtml = await render(
      NewListingAdminNotification({
        listingTitle: data.listingTitle,
        sellerName: data.sellerName,
        sellerEmail: data.sellerEmail,
        sellerWhatsapp: data.sellerWhatsapp,
        listingId: data.listingId,
        expectedPrice: data.expectedPrice,
        currency: data.currency,
        channelLink: data.channelLink,
        adminUrl,
      })
    );
    
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `New Channel Listing Submitted: ${data.listingTitle}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending admin notification email:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending admin notification email:", error);
    return { success: false, error };
  }
}

export async function sendListingApprovedSellerNotification(
  data: ListingApprovedEmailData
) {
  try {
    const emailHtml = await render(
      ListingApprovedSellerNotification({
        listingTitle: data.listingTitle,
        sellerName: data.sellerName,
        listingId: data.listingId,
        listingUrl: data.listingUrl,
      })
    );
    
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.sellerEmail],
      subject: `Your Listing is Now Live: ${data.listingTitle}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending seller notification email:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending seller notification email:", error);
    return { success: false, error };
  }
}
