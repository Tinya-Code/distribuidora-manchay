import { Money } from '../shared';
import { PriceTier } from './PriceTier';

export type PriceListKind = 'retail' | 'wholesale';

export class PriceList {
  readonly kind: PriceListKind;
  readonly tiers: readonly PriceTier[];

  constructor(kind: PriceListKind, tiers: PriceTier[]) {
    const sorted = [...tiers].sort((a, b) => a.minQty - b.minQty);
    this.kind = kind;
    this.tiers = sorted;
  }

  priceFor(qty: number): Money {
    if (this.tiers.length === 0) throw new Error('PriceList has no tiers');
    let chosen = this.tiers[0];
    for (const tier of this.tiers) {
      if (qty >= tier.minQty) chosen = tier;
      else break;
    }
    return chosen.price;
  }

  nextTier(qty: number): PriceTier | null {
    for (const tier of this.tiers) {
      if (qty < tier.minQty) return tier;
    }
    return null;
  }

  allTiers(): readonly PriceTier[] {
    return this.tiers;
  }
}
