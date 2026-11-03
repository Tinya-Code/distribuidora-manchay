import { Product, Category, DeliveryZone } from '../../domain';

export interface CatalogSource {
  products(): Product[];
  categories(): Category[];
  zones(): DeliveryZone[];
}
