import { CatalogSource } from '../../application';
import { Product, Category, DeliveryZone } from '../../domain';

export class StaticCatalogSource implements CatalogSource {
  constructor(
    private readonly productsData: Product[] = [],
    private readonly categoriesData: Category[] = [],
    private readonly zonesData: DeliveryZone[] = [],
  ) {}

  products(): Product[] {
    return this.productsData;
  }
  categories(): Category[] {
    return this.categoriesData;
  }
  zones(): DeliveryZone[] {
    return this.zonesData;
  }
}
