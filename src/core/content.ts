import { defineCollection, z } from 'astro:content';
import {
  validateCategoryContent,
  validateBrandContent,
  validateProductContent,
  validateZoneContent,
  validateSegmentContent,
  validateReviewContent,
  validateFaqContent,
  validatePageContent,
} from './config';

// Schemas as zod objects (minimal)
const categorySchema = z.object({ id: z.string(), name: z.string() }).passthrough();
const brandSchema = z.object({ id: z.string(), name: z.string() }).passthrough();
const productSchema = z.object({ id: z.string(), name: z.string(), categoryId: z.string(), presentations: z.array(z.any()) }).passthrough();
const zoneSchema = z.object({ id: z.string(), name: z.string(), minOrder: z.number() }).passthrough();
const segmentSchema = z.object({ id: z.string(), name: z.string() }).passthrough();
const reviewSchema = z.object({ id: z.string(), author: z.string(), text: z.string() }).passthrough();
const faqSchema = z.object({ id: z.string(), question: z.string(), answer: z.string() }).passthrough();
const pageSchema = z.object({ slug: z.string(), title: z.string() }).passthrough();

export function defineContentCollections() {
  return {
    categories: defineCollection({ type: 'content', schema: categorySchema }),
    brands: defineCollection({ type: 'content', schema: brandSchema }),
    products: defineCollection({ type: 'content', schema: productSchema }),
    zones: defineCollection({ type: 'content', schema: zoneSchema }),
    segments: defineCollection({ type: 'content', schema: segmentSchema }),
    reviews: defineCollection({ type: 'content', schema: reviewSchema }),
    faqs: defineCollection({ type: 'content', schema: faqSchema }),
    pages: defineCollection({ type: 'content', schema: pageSchema }),
  };
}

// Keep validators referenced
export const _validators = {
  validateCategoryContent,
  validateBrandContent,
  validateProductContent,
  validateZoneContent,
  validateSegmentContent,
  validateReviewContent,
  validateFaqContent,
  validatePageContent,
};
