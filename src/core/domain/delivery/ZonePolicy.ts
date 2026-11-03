import { Money } from '../shared';
import { DeliveryZone } from './DeliveryZone';

export class ZonePolicy {
  shippingCost(zone: DeliveryZone, subtotal: Money): Money {
    if (zone.freeShippingFrom && subtotal.amount >= zone.freeShippingFrom.amount) {
      return Money.zero(subtotal.currency);
    }
    return zone.shippingCost;
  }

  isFreeShipping(zone: DeliveryZone, subtotal: Money): boolean {
    return !!zone.freeShippingFrom && subtotal.amount >= zone.freeShippingFrom.amount;
  }

  meetsMinimum(zone: DeliveryZone, subtotal: Money): boolean {
    return subtotal.amount >= zone.minOrder.amount;
  }

  shortfallToMinimum(zone: DeliveryZone, subtotal: Money): Money {
    const diff = zone.minOrder.subtract(subtotal);
    return diff.isPositive() ? diff : Money.zero(subtotal.currency);
  }

  shortfallToFreeShipping(zone: DeliveryZone, subtotal: Money): Money {
    if (!zone.freeShippingFrom) return Money.zero(subtotal.currency);
    const diff = zone.freeShippingFrom.subtract(subtotal);
    return diff.isPositive() ? diff : Money.zero(subtotal.currency);
  }
}
