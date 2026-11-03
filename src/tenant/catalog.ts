import { StaticCatalogSource } from '../core/infrastructure';
import { products, categories, zones } from './data';

export const catalog = new StaticCatalogSource(products, categories, zones);
export default catalog;
