import { Resend } from "resend";
import { render } from "@react-email/render";
import { NewListingAdminNotification } from "@/components/emails/new-listing-admin-notification";
import { ListingApprovedSellerNotification } from "@/components/emails/listing-approved-seller-notification";
import { PasswordResetEmail } from "@/components/emails/password-reset-email";
import { OrderConfirmationEmail } from "@/components/emails/order-confirmation";
import { OrderCompletedEmail } from "@/components/emails/order-completed";
import { OrderDeliveredEmail } from "@/components/emails/order-delivered";
import { OrderPaymentAdminNotification } from "@/components/emails/order-payment-admin-notification";

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

interface PasswordResetEmailData {
  to: string;
  resetUrl: string;
  userName: string;
}

export async function sendPasswordResetEmail(
  data: PasswordResetEmailData
) {
  try {
    const emailHtml = await render(
      PasswordResetEmail({
        resetUrl: data.resetUrl,
        userName: data.userName,
      })
    );
    
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.to],
      subject: "Reset Your Password - YT Shop India",
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending password reset email:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error };
  }
}

interface OrderConfirmationEmailData {
  to: string;
  orderId: string;
  channelTitle: string;
  amount: string;
  currency: string;
  customerName: string;
}

interface OrderCompletedEmailData {
  to: string;
  orderId: string;
  channelTitle: string;
  customerName: string;
}

export async function sendOrderConfirmationEmail(
  data: OrderConfirmationEmailData
) {
  try {
    const emailHtml = await render(
      OrderConfirmationEmail({
        orderId: data.orderId,
        channelTitle: data.channelTitle,
        amount: data.amount,
        currency: data.currency,
        customerName: data.customerName,
      })
    );
    
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.to],
      subject: `Order Confirmed - ${data.channelTitle} | YT Shop India`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending order confirmation email:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return { success: false, error };
  }
}

export async function sendOrderCompletedEmail(
  data: OrderCompletedEmailData
) {
  try {
    const emailHtml = await render(
      OrderCompletedEmail({
        orderId: data.orderId,
        channelTitle: data.channelTitle,
        customerName: data.customerName,
      })
    );
    
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.to],
      subject: `Payment Confirmed - Order #${data.orderId} | YT Shop India`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending order completed email:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending order completed email:", error);
    return { success: false, error };
  }
}

interface OrderDeliveredEmailData {
  to: string;
  orderId: string;
  channelTitle: string;
  deliveryDetails: string;
  customerName: string;
}

export async function sendOrderDeliveredEmail(
  data: OrderDeliveredEmailData
) {
  try {
    const emailHtml = await render(
      OrderDeliveredEmail({
        orderId: data.orderId,
        channelTitle: data.channelTitle,
        deliveryDetails: data.deliveryDetails,
        customerName: data.customerName,
      })
    );
    
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.to],
      subject: `Order Delivered - ${data.channelTitle} | YT Shop India`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending order delivered email:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending order delivered email:", error);
    return { success: false, error };
  }
}

interface OrderPaymentAdminNotificationData {
  orderId: string;
  channelTitle: string;
  amount: string;
  currency: string;
  customerName: string;
  customerEmail: string;
  isGuest: boolean;
}

export async function sendOrderPaymentAdminNotification(
  data: OrderPaymentAdminNotificationData
) {
  try {
    const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/orders`;
    
    const emailHtml = await render(
      OrderPaymentAdminNotification({
        orderId: data.orderId,
        channelTitle: data.channelTitle,
        amount: data.amount,
        currency: data.currency,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        isGuest: data.isGuest,
        adminUrl,
      })
    );
    
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `💰 Payment Received - Order #${data.orderId.slice(0, 8)} | ${data.channelTitle}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending admin order payment notification:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending admin order payment notification:", error);
    return { success: false, error };
  }
}
