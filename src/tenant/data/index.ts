import businessRaw from './business.json';
import categoriesRaw from './categories.json';
import brandsRaw from './brands.json';
import productsRaw from './products.json';
import zonesRaw from './zones.json';
import segmentsRaw from './segments.json';
import reviewsRaw from './reviews.json';
import faqsRaw from './faqs.json';
import pagesRaw from './pages.json';

import { validateTenantConfig } from '../../core/config';
import {
  validateCategoryContent,
  validateBrandContent,
  validateProductContent,
  validateZoneContent,
  validateSegmentContent,
  validateReviewContent,
  validateFaqContent,
  validatePageContent,
} from '../../core/config';
import { toCategory, toProduct, toZone } from '../../core/infrastructure/catalog/mappers';
import { Category, Product, DeliveryZone } from '../../core/domain';

// Validate business config
export const business = validateTenantConfig(businessRaw);

// Validate and map categories
export const categories: Category[] = (categoriesRaw as any[]).map((c) => {
  validateCategoryContent(c);
  return toCategory(c);
});

// Validate brands (no domain class yet, export raw validated)
export const brands = (brandsRaw as any[]).map((b) => {
  validateBrandContent(b);
  return b;
});

// Validate and map products
export const products: Product[] = (productsRaw as any[]).map((p) => {
  validateProductContent(p);
  return toProduct(p);
});

// Validate and map zones
export const zones: DeliveryZone[] = (zonesRaw as any[]).map((z) => {
  validateZoneContent(z);
  return toZone(z);
});

// Validate segments
export const segments = (segmentsRaw as any[]).map((s) => {
  validateSegmentContent(s);
  return s;
});

// Validate reviews
export const reviews = (reviewsRaw as any[]).map((r) => {
  validateReviewContent(r);
  return r;
});

// Validate faqs
export const faqs = (faqsRaw as any[]).map((f) => {
  validateFaqContent(f);
  return f;
});

// Validate pages
export const pages = (pagesRaw as any[]).map((p) => {
  validatePageContent(p);
  return p;
});

// Convenience: catalog source data
export const catalogData = {
  products,
  categories,
  zones,
};