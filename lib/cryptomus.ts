import crypto from "crypto";

const CRYPTOMUS_MERCHANT_ID = process.env.CRYPTOMUS_MERCHANT_ID || "";
const CRYPTOMUS_PAYMENT_API_KEY = process.env.CRYPTOMUS_PAYMENT_API_KEY || "";
const CRYPTOMUS_BASE_URL = process.env.CRYPTOMUS_BASE_URL || "https://api.cryptomus.com/v1";

interface CreateInvoiceParams {
  amount: string;
  currency: string;
  orderId: string;
  urlReturn?: string;
  urlSuccess?: string;
  urlCallback?: string;
  network?: string; // e.g., "TRC20", "BSC", "ETH"
  isPaymentMultiple?: boolean;
  lifetime?: number; // Payment lifetime in minutes
  toCurrency?: string; // Convert to specific crypto currency
}

interface CryptomusInvoiceResponse {
  state: number;
  result: {
    uuid: string;
    order_id: string;
    amount: string;
    payment_amount: string;
    payment_amount_usd: string;
    currency: string;
    network: string;
    address: string;
    from: string;
    txid: string;
    payment_status: string;
    url: string;
    expired_at: number;
    status: string;
    is_payment_multiple: boolean;
    is_final: boolean;
    additional_data: string | null;
    currencies: Array<{
      currency: string;
      network: string;
      address: string;
      from: string;
      rate: string;
    }>;
  };
}

interface CryptomusPaymentStatusResponse {
  state: number;
  result: {
    uuid: string;
    order_id: string;
    amount: string;
    payment_amount: string;
    payment_amount_usd: string;
    currency: string;
    network: string;
    address: string;
    from: string;
    txid: string;
    payment_status: string;
    url: string;
    expired_at: number;
    status: string;
    is_final: boolean;
  };
}

/**
 * Generate signature for Cryptomus API requests
 */
function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHash("md5")
    .update(Buffer.from(payload).toString("base64") + secret)
    .digest("hex");
}

/**
 * Create a payment invoice in Cryptomus
 */
export async function createCryptomusInvoice(
  params: CreateInvoiceParams
): Promise<CryptomusInvoiceResponse> {
  if (!CRYPTOMUS_MERCHANT_ID || !CRYPTOMUS_PAYMENT_API_KEY) {
    throw new Error("Cryptomus credentials are not configured");
  }

  const payload = {
    amount: params.amount,
    currency: params.currency,
    order_id: params.orderId,
    url_return: params.urlReturn,
    url_success: params.urlSuccess,
    url_callback: params.urlCallback,
    network: params.network,
    is_payment_multiple: params.isPaymentMultiple ?? true,
    lifetime: (params.lifetime || 60) * 60, // Convert minutes to seconds (default 60 mins)
    to_currency: params.toCurrency,
  };

  const payloadString = JSON.stringify(payload);
  const signature = generateSignature(payloadString, CRYPTOMUS_PAYMENT_API_KEY);

  const response = await fetch(`${CRYPTOMUS_BASE_URL}/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "merchant": CRYPTOMUS_MERCHANT_ID,
      "sign": signature,
    },
    body: payloadString,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cryptomus API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data as CryptomusInvoiceResponse;
}

/**
 * Get payment status from Cryptomus
 */
export async function getCryptomusPaymentStatus(
  orderId: string
): Promise<CryptomusPaymentStatusResponse> {
  if (!CRYPTOMUS_MERCHANT_ID || !CRYPTOMUS_PAYMENT_API_KEY) {
    throw new Error("Cryptomus credentials are not configured");
  }

  const payload = {
    order_id: orderId,
  };

  const payloadString = JSON.stringify(payload);
  const signature = generateSignature(payloadString, CRYPTOMUS_PAYMENT_API_KEY);

  const response = await fetch(`${CRYPTOMUS_BASE_URL}/payment/info`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "merchant": CRYPTOMUS_MERCHANT_ID,
      "sign": signature,
    },
    body: payloadString,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cryptomus API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data as CryptomusPaymentStatusResponse;
}

/**
 * Verify webhook signature from Cryptomus
 * Per Cryptomus docs: extract sign from body, remove it, then compute
 * md5(base64(json_encode(data)) + apiKey). The sign is in the webhook body, not headers.
 */
export function verifyCryptomusWebhook(body: string): boolean {
  if (!CRYPTOMUS_PAYMENT_API_KEY) {
    return false;
  }

  try {
    const data = JSON.parse(body) as Record<string, unknown>;
    const receivedSign = data.sign;
    if (typeof receivedSign !== "string") {
      return false;
    }

    // Cryptomus computes the sign over the payload WITHOUT the sign field
    delete data.sign;
    const payloadForSigning = JSON.stringify(data);
    const expectedSignature = generateSignature(payloadForSigning, CRYPTOMUS_PAYMENT_API_KEY);
    return expectedSignature === receivedSign;
  } catch {
    return false;
  }
}

/**
 * Convert INR to USD using real-time exchange rate
 * @deprecated Use convertInrToUsd from lib/exchange-rate.ts instead
 */
export async function convertInrToUsd(inrAmount: string): Promise<number> {
  // Import dynamically to avoid circular dependencies
  const { convertInrToUsd: convertRate } = await import("./exchange-rate");
  return convertRate(inrAmount);
}

/**
 * Format amount for Cryptomus (must be string with 2 decimal places)
 */
export function formatAmountForCryptomus(amount: number): string {
  return amount.toFixed(2);
}

