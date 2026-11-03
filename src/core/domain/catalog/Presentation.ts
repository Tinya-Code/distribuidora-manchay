import { PresentationId, Money } from '../shared';
import { PriceList } from './PriceList';

export class Presentation {
  readonly id: PresentationId;
  readonly name: string;
  readonly units: number;
  readonly sku?: string;
  readonly retailPrices: PriceList;
  readonly wholesalePrices: PriceList;

  constructor(params: {
    id: PresentationId;
    name: string;
    units: number;
    sku?: string;
    retailPrices: PriceList;
    wholesalePrices: PriceList;
  }) {
    if (params.units < 1) throw new Error('units must be >= 1');
    this.id = params.id;
    this.name = params.name;
    this.units = params.units;
    this.sku = params.sku;
    this.retailPrices = params.retailPrices;
    this.wholesalePrices = params.wholesalePrices;
  }

  priceList(mode: 'home' | 'business'): PriceList {
    return mode === 'business' ? this.wholesalePrices : this.retailPrices;
  }

  priceFor(qty: number, mode: 'home' | 'business'): Money {
    return this.priceList(mode).priceFor(qty);
  }
}
