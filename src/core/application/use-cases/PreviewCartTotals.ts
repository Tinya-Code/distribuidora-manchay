import { Cart, PricingMode, Money, Product, Presentation, ZonePolicy, DeliveryZone } from '../../domain';
import { CatalogSource } from '../ports';
import { PricingService } from '../../domain';
import { CartTotals } from '../dto';

export class PreviewCartTotals {
  constructor(
    private readonly catalog: CatalogSource,
    private readonly pricing: PricingService,
  ) {}

  execute(cart: Cart, mode: PricingMode, zone?: DeliveryZone): CartTotals {
    const zonePolicy = new ZonePolicy();
    let subtotal = Money.zero();
    let discount = Money.zero();

    for (const line of cart.getLines()) {
      const product = this.catalog.products().find((p) => p.id === line.productId);
      const presentation = product?.presentations.find((pr) => pr.id === line.presentationId);
      if (!product || !presentation) continue;
      const unitPrice = this.pricing.unitPrice(presentation, line.quantity, mode);
      subtotal = subtotal.add(unitPrice.multiply(line.quantity));

      const tiers = presentation.priceList(mode).allTiers();
      if (tiers.length > 0) {
        const firstPrice = tiers[0].price;
        const savingPerUnit = firstPrice.subtract(unitPrice);
        if (savingPerUnit.isPositive()) {
          discount = discount.add(savingPerUnit.multiply(line.quantity));
        }
      }
    }

    let shipping = Money.zero();
    let missingForMinimum = Money.zero();
    let missingForFreeShipping = Money.zero();
    if (zone) {
      shipping = zonePolicy.shippingCost(zone, subtotal);
      missingForMinimum = zonePolicy.shortfallToMinimum(zone, subtotal);
      missingForFreeShipping = zonePolicy.shortfallToFreeShipping(zone, subtotal);
    }
    const total = subtotal.add(shipping);

    return { subtotal, discount, shipping, total, missingForMinimum, missingForFreeShipping };
  }
}
