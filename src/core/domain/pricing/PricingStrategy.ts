import { Money } from '../shared';
import { PricingMode } from '../shared';
import { Presentation } from '../catalog';
import { PriceTier } from '../catalog';

export interface PricingStrategy {
  priceFor(presentation: Presentation, qty: number, mode: PricingMode): Money;
  nextTier(presentation: Presentation, qty: number, mode: PricingMode): PriceTier | null;
  savingsToNextTier(presentation: Presentation, qty: number, mode: PricingMode): Money;
}
