import { Product, Category } from '../../domain';
import { CatalogSource } from '../ports';

export interface CatalogFilter {
  categoryId?: string;
  brandId?: string;
  availableOnly?: boolean;
  query?: string;
}

export class CatalogQuery {
  constructor(private readonly catalog: CatalogSource) {}

  all(): Product[] {
    return this.catalog.products();
  }

  byCategory(categoryId: string): Product[] {
    return this.catalog.products().filter((p) => String(p.categoryId) === categoryId);
  }

  filter(f: CatalogFilter): Product[] {
    let result = this.catalog.products();
    if (f.categoryId) result = result.filter((p) => String(p.categoryId) === f.categoryId);
    if (f.brandId) result = result.filter((p) => String(p.brandId) === f.brandId);
    if (f.availableOnly) result = result.filter((p) => p.available);
    if (f.query) {
      const q = f.query.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    return result;
  }

  search(query: string): Product[] {
    return this.filter({ query });
  }

  sort(products: Product[], by: 'name' | 'price' = 'name'): Product[] {
    const copy = [...products];
    if (by === 'name') copy.sort((a, b) => a.name.localeCompare(b.name));
    return copy;
  }
}
