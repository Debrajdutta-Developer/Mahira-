export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to INR (1 INR = rate)
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rate: 1 },
  USD: { code: 'USD', symbol: '$', rate: 0.012 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0094 },
  AED: { code: 'AED', symbol: 'AED ', rate: 0.044 },
};

export interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  priceINR: number;
  image: string;
  quantity: number;
  size?: string;
}

export function formatPrice(amountINR: number, currency: CurrencyCode = 'INR'): string {
  const config = CURRENCIES[currency] || CURRENCIES.INR;
  const converted = Math.round(amountINR * config.rate);
  return `${config.symbol}${converted.toLocaleString('en-IN')}`;
}

export function calculateCartTotals(
  items: CartItem[],
  promoDiscountPercent = 0,
  freeShippingThresholdINR = 5000
) {
  const subtotalINR = items.reduce((acc, item) => acc + item.priceINR * item.quantity, 0);
  const discountINR = Math.round(subtotalINR * (promoDiscountPercent / 100));
  const subtotalAfterDiscount = subtotalINR - discountINR;
  const isFreeShipping = subtotalINR >= freeShippingThresholdINR || items.length === 0;
  const shippingINR = isFreeShipping ? 0 : 350;
  const totalINR = subtotalAfterDiscount + shippingINR;

  return {
    itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
    subtotalINR,
    discountINR,
    shippingINR,
    totalINR,
    isFreeShipping,
    amountNeededForFreeShippingINR: Math.max(0, freeShippingThresholdINR - subtotalINR),
  };
}

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function applyPromoCode(code: string): { valid: boolean; discountPercent: number; message: string } {
  const cleaned = code.trim().toUpperCase();
  if (cleaned === 'MAHIRA15') {
    return { valid: true, discountPercent: 15, message: '15% Mahira heritage discount applied!' };
  }
  if (cleaned === 'WELCOME10') {
    return { valid: true, discountPercent: 10, message: '10% Welcome gift applied!' };
  }
  if (cleaned === 'KALAKAARI20') {
    return { valid: true, discountPercent: 20, message: '20% Kalakaari festival discount applied!' };
  }
  return { valid: false, discountPercent: 0, message: 'Invalid or expired promotional code' };
}
