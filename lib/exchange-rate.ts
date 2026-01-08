/**
 * Exchange Rate Service
 * Fetches real-time exchange rates from free APIs
 */

const EXCHANGE_RATE_API = "https://api.exchangerate-api.com/v4/latest/USD";
const FALLBACK_RATE = 90; // Fallback rate if API fails

interface ExchangeRateResponse {
  rates: {
    INR: number;
  };
}

/**
 * Get current USD to INR exchange rate
 * Uses exchangerate-api.com (free, no API key required)
 * Falls back to environment variable or default if API fails
 */
export async function getUsdToInrRate(): Promise<number> {
  try {
    // Try to get rate from environment first (for manual override)
    const envRate = process.env.USD_TO_INR_RATE;
    if (envRate) {
      const parsed = parseFloat(envRate);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }

    // Fetch from API
    const response = await fetch(EXCHANGE_RATE_API, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Exchange rate API returned ${response.status}`);
    }

    const data = (await response.json()) as ExchangeRateResponse;
    const rate = data.rates?.INR;

    if (!rate || isNaN(rate) || rate <= 0) {
      throw new Error("Invalid exchange rate from API");
    }

    return rate;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    console.log(`Using fallback rate: ${FALLBACK_RATE}`);
    return FALLBACK_RATE;
  }
}

/**
 * Convert INR to USD using real-time exchange rate
 */
export async function convertInrToUsd(inrAmount: string): Promise<number> {
  const exchangeRate = await getUsdToInrRate();
  const amount = parseFloat(inrAmount.replace(/[^0-9.]/g, ""));
  
  if (isNaN(amount)) {
    throw new Error("Invalid INR amount");
  }
  
  return parseFloat((amount / exchangeRate).toFixed(2));
}

/**
 * Get cached exchange rate (for client-side use)
 * This should be fetched server-side and passed to client
 */
export function getCachedRate(): number {
  return parseFloat(process.env.USD_TO_INR_RATE || String(FALLBACK_RATE));
}

