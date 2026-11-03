import { Money, PricingMode } from '../../domain';

export interface CartTotals {
  subtotal: Money;
  discount: Money;
  shipping: Money;
  total: Money;
  missingForMinimum: Money;
  missingForFreeShipping: Money;
}

export interface SubmitOrderInput {
  zoneId: string;
  address: string;
  reference?: string;
  date?: string;
  slot?: string;
  customerName: string;
  customerPhone: string;
  customerType: 'home' | 'business';
  businessName?: string;
  document?: string;
  paymentMethod: 'cash' | 'yape' | 'plin' | 'transfer';
  cashAmount?: number;
  invoice: 'boleta' | 'factura';
  notes?: string;
  pricingMode: PricingMode;
}

export interface SubmitQuoteInput {
  customerName: string;
  customerPhone: string;
  businessName?: string;
  notes?: string;
  pricingMode: PricingMode;
}
