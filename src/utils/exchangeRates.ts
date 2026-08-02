export interface ExchangeRateData {
  base: string;
  rates: Record<string, number>;
  time_last_update_utc: string;
}

// Sensible pre-seeded exchange rates fallback for common world currencies to USD
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  NGN: 1500.0,
  TZS: 2600.0,
  KES: 130.0,
  GHS: 14.5,
  ZAR: 18.2,
  CAD: 1.36,
  AUD: 1.5,
  INR: 83.5,
  CNY: 7.25,
  SAR: 3.75,
  AED: 3.67,
  EGP: 48.0,
  UGX: 3750.0,
  RWF: 1300.0,
  PKR: 278.0,
  PHP: 58.5,
  VND: 25400.0,
  TRY: 32.8,
  IDR: 16400.0,
  BRL: 5.4,
  MXN: 18.5,
  RUB: 88.0,
  JPY: 158.0
};

const STORAGE_KEY = 'thesdel_cached_exchange_rates';
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // Cache rates for 6 hours

export async function fetchExchangeRates(): Promise<Record<string, number>> {
  try {
    // Check local cache first
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const now = Date.now();
      if (now - parsed.timestamp < CACHE_DURATION_MS) {
        console.log('[Currency] Using cached exchange rates');
        return parsed.rates;
      }
    }

    // Attempt to fetch from free API (no keys required)
    console.log('[Currency] Fetching latest exchange rates relative to USD...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ExchangeRateData = await response.json();
    if (data && data.rates) {
      const payload = {
        rates: { ...FALLBACK_RATES, ...data.rates },
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      console.log('[Currency] Successfully loaded and cached exchange rates');
      return payload.rates;
    }
    
    throw new Error('Invalid rate structure');
  } catch (err) {
    console.warn('[Currency] Failed to fetch live exchange rates, falling back to local preloaded rates:', err);
    
    // Return cached rates even if expired if we have them, otherwise fall back completely
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached).rates;
      } catch (e) {
        // ignore
      }
    }
    return FALLBACK_RATES;
  }
}

/**
 * Convert a USD amount to a target currency.
 * If target rate is unavailable, returns conversion in USD.
 */
export function convertUsdTo(amountUsd: number, rates: Record<string, number>, targetCurrency: string): { amount: number; rate: number } {
  const rate = rates[targetCurrency] || FALLBACK_RATES[targetCurrency] || 1.0;
  return {
    amount: parseFloat((amountUsd * rate).toFixed(2)),
    rate
  };
}
