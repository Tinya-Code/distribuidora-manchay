import { ConsumptionCalculator, ConsumptionInput, Product } from '../../domain';
import { CatalogSource } from '../ports';

export interface SuggestedConsumption {
  items: ReturnType<ConsumptionCalculator['suggest']>;
  products: Product[];
}

export class SuggestConsumption {
  constructor(private readonly calculator: ConsumptionCalculator, private readonly catalog: CatalogSource) {}

  execute(input: ConsumptionInput): SuggestedConsumption {
    const items = this.calculator.suggest(input);
    // best-effort: return all products as candidates
    return { items, products: this.catalog.products() };
  }
}
