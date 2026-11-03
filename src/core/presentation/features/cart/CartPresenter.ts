import { Cart, Product, Presentation, PricingMode, Money } from '../../../domain';
import { PricingService } from '../../../domain';

export interface CartLineView {
  productId: string;
  presentationId: string;
  name: string;
  presentation: string;
  price: string;
  quantity: number;
  subtotal: string;
}

export interface CartTotalsView {
  subtotal: string;
  shipping: string;
  total: string;
  missingMinimum: string;
  missingFreeShipping: string;
}

export class CartPresenter {
  constructor(private readonly pricing: PricingService) {}

  lineView(
    productId: string,
    presentationId: string,
    quantity: number,
    productName: string,
    presentationName: string,
    presentation: Presentation,
    mode: PricingMode,
  ): CartLineView {
    const unitPrice = this.pricing.unitPrice(presentation, quantity, mode);
    const subtotal = unitPrice.multiply(quantity);
    return {
      productId,
      presentationId,
      name: productName,
      presentation: presentationName,
      price: unitPrice.format(),
      quantity,
      subtotal: subtotal.format(),
    };
  }

  totalsView(subtotal: Money, shipping: Money, total: Money, missingMin: Money, missingFree: Money): CartTotalsView {
    return {
      subtotal: subtotal.format(),
      shipping: shipping.format(),
      total: total.format(),
      missingMinimum: missingMin.format(),
      missingFreeShipping: missingFree.format(),
    };
  }
}
