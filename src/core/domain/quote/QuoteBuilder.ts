import { ProductId, PresentationId, Money } from '../shared';
import { PricingMode } from '../shared';
import { Result, ok, err } from '../shared';
import { Product } from '../catalog';
import { Presentation } from '../catalog';
import { PricingService } from '../pricing';
import { QuoteCode } from './QuoteCode';
import { Quote, QuoteLine } from './Quote';

export interface QuoteBuildInput {
  code: QuoteCode;
  customerName: string;
  customerPhone: string;
  businessName?: string;
  notes?: string;
  cartLines: { productId: ProductId; presentationId: PresentationId; quantity: number }[];
  resolveProduct: (id: ProductId) => Product | undefined;
  resolvePresentation: (productId: ProductId, presentationId: PresentationId) => Presentation | undefined;
  pricingMode: PricingMode;
  pricingService: PricingService;
  createdAt?: Date;
}

export class QuoteBuilder {
  static build(input: QuoteBuildInput): Result<Quote, string[]> {
    const errors: string[] = [];
    if (!input.customerName?.trim()) errors.push('Customer name is required');
    if (!input.customerPhone?.trim()) errors.push('Customer phone is required');
    if (!input.cartLines || input.cartLines.length === 0) errors.push('Cart is empty');

    const lines: QuoteLine[] = [];
    let total = Money.zero();

    for (const cl of input.cartLines ?? []) {
      const product = input.resolveProduct(cl.productId);
      if (!product) {
        errors.push(`Product not found: ${cl.productId}`);
        continue;
      }
      const presentation = input.resolvePresentation(cl.productId, cl.presentationId);
      if (!presentation) {
        errors.push(`Presentation not found: ${cl.presentationId}`);
        continue;
      }
      if (cl.quantity < 1) {
        errors.push(`Invalid quantity for ${product.name}`);
        continue;
      }
      const unitPrice = input.pricingService.unitPrice(presentation, cl.quantity, input.pricingMode);
      const subtotal = unitPrice.multiply(cl.quantity);
      lines.push({
        productId: cl.productId,
        presentationId: cl.presentationId,
        productName: product.name,
        presentationName: presentation.name,
        quantity: cl.quantity,
        unitPrice,
        subtotal,
      });
      total = total.add(subtotal);
    }

    if (errors.length > 0) return err(errors);

    const quote = new Quote({
      code: input.code,
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      businessName: input.businessName?.trim(),
      notes: input.notes?.trim(),
      lines,
      total,
      createdAt: input.createdAt,
    });
    return ok(quote);
  }
}
