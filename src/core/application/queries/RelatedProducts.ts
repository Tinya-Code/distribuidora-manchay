import { Product } from '../../domain';
import { CatalogSource } from '../ports';

export class RelatedProducts {
  constructor(private readonly catalog: CatalogSource) {}

  complements(product: Product): Product[] {
    const ids = new Set(product.complements.map(String));
    return this.catalog.products().filter((p) => ids.has(String(p.id)));
  }

  alternatives(product: Product): Product[] {
    const ids = new Set(product.alternatives.map(String));
    return this.catalog.products().filter((p) => ids.has(String(p.id)));
  }
}
