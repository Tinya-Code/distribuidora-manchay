import { ProductId, PresentationId, Money } from '../shared';
import { PricingMode } from '../shared';
import { Result, ok, err } from '../shared';
import { Product } from '../catalog';
import { Presentation } from '../catalog';
import { PricingService } from '../pricing';
import { DeliveryZone } from '../delivery';
import { ZonePolicy } from '../delivery';
import { Customer } from './Customer';
import { OrderLine } from './OrderLine';
import { Order, OrderDelivery, OrderPayment, InvoiceType } from './Order';
import { OrderCode } from './OrderCode';

export interface OrderBuildInput {
  code: OrderCode;
  customer: Customer;
  cartLines: { productId: ProductId; presentationId: PresentationId; quantity: number }[];
  resolveProduct: (id: ProductId) => Product | undefined;
  resolvePresentation: (productId: ProductId, presentationId: PresentationId) => Presentation | undefined;
  pricingMode: PricingMode;
  pricingService: PricingService;
  zone: DeliveryZone;
  delivery: { address: string; reference?: string; date?: string; slot?: string };
  payment: OrderPayment;
  invoice: InvoiceType;
  notes?: string;
  zonePolicy?: ZonePolicy;
  createdAt?: Date;
}

export class OrderBuilder {
  static build(input: OrderBuildInput): Result<Order, string[]> {
    const errors: string[] = [];

    if (!input.cartLines || input.cartLines.length === 0) errors.push('Cart is empty');
    if (!input.customer.name?.trim()) errors.push('Customer name is required');
    if (!input.customer.phone?.trim()) errors.push('Customer phone is required');
    if (!input.delivery.address?.trim()) errors.push('Delivery address is required');
    if (!input.zone) errors.push('Delivery zone is required');

    const zonePolicy = input.zonePolicy ?? new ZonePolicy();

    const lines: OrderLine[] = [];
    let subtotal = Money.zero();
    let discount = Money.zero();

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
      const lineSubtotal = unitPrice.multiply(cl.quantity);
      lines.push(
        new OrderLine({
          productId: cl.productId,
          presentationId: cl.presentationId,
          productName: product.name,
          presentationName: presentation.name,
          quantity: cl.quantity,
          unitPrice,
        }),
      );
      subtotal = subtotal.add(lineSubtotal);

      // volume discount vs first tier
      const tiers = presentation.priceList(input.pricingMode).allTiers();
      if (tiers.length > 0) {
        const firstPrice = tiers[0].price;
        const savingPerUnit = firstPrice.subtract(unitPrice);
        if (savingPerUnit.isPositive()) {
          discount = discount.add(savingPerUnit.multiply(cl.quantity));
        }
      }
    }

    if (input.zone && !zonePolicy.meetsMinimum(input.zone, subtotal)) {
      errors.push(`Order does not meet minimum for zone: ${input.zone.minOrder.format()}`);
    }

    if (errors.length > 0) return err(errors);

    const shipping = zonePolicy.shippingCost(input.zone, subtotal);
    const total = subtotal.add(shipping);

    const delivery: OrderDelivery = {
      zoneId: input.zone.id,
      address: input.delivery.address.trim(),
      reference: input.delivery.reference?.trim(),
      date: input.delivery.date,
      slot: input.delivery.slot,
    };

    const order = new Order({
      code: input.code,
      customer: input.customer,
      lines,
      delivery,
      payment: input.payment,
      invoice: input.invoice,
      notes: input.notes,
      subtotal,
      discount,
      shipping,
      total,
      createdAt: input.createdAt,
    });

    return ok(order);
  }
}
