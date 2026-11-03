import { Money } from '../shared';

export class PriceTier {
  readonly minQty: number;
  readonly price: Money;

  constructor(minQty: number, price: Money) {
    if (minQty < 1) throw new Error('minQty must be >= 1');
    this.minQty = minQty;
    this.price = price;
  }

  equals(other: PriceTier): boolean {
    return this.minQty === other.minQty && this.price.equals(other.price);
  }
}
