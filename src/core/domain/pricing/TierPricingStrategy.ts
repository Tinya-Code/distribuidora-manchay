import { Money } from '../shared';
import { PricingMode } from '../shared';
import { Presentation } from '../catalog';
import { PriceTier } from '../catalog';
import { PricingStrategy } from './PricingStrategy';

export class TierPricingStrategy implements PricingStrategy {
  priceFor(presentation: Presentation, qty: number, mode: PricingMode): Money {
    return presentation.priceFor(qty, mode);
  }

  nextTier(presentation: Presentation, qty: number, mode: PricingMode): PriceTier | null {
    return presentation.priceList(mode).nextTier(qty);
  }

  savingsToNextTier(presentation: Presentation, qty: number, mode: PricingMode): Money {
    const current = this.priceFor(presentation, qty, mode);
    const next = this.nextTier(presentation, qty, mode);
    if (!next) return Money.zero(current.currency);
    const diff = current.subtract(next.price);
    const savings = diff.amount > 0 ? diff.multiply(qty) : Money.zero(current.currency);
    return savings;
  }
}
