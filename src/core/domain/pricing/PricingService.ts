import { Money } from '../shared';
import { PricingMode } from '../shared';
import { Presentation } from '../catalog';
import { PriceTier } from '../catalog';
import { PricingStrategy } from './PricingStrategy';

export class PricingService {
  constructor(private readonly strategy: PricingStrategy) {}

  unitPrice(presentation: Presentation, qty: number, mode: PricingMode): Money {
    return this.strategy.priceFor(presentation, qty, mode);
  }

  lineTotal(presentation: Presentation, qty: number, mode: PricingMode): Money {
    return this.unitPrice(presentation, qty, mode).multiply(qty);
  }

  nextTier(presentation: Presentation, qty: number, mode: PricingMode): PriceTier | null {
    return this.strategy.nextTier(presentation, qty, mode);
  }

  savingsToNextTier(presentation: Presentation, qty: number, mode: PricingMode): Money {
    return this.strategy.savingsToNextTier(presentation, qty, mode);
  }
}
