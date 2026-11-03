export interface ProductContent {
  id: string;
  name: string;
  categoryId: string;
  brandId?: string;
  available?: boolean;
  featured?: boolean;
  returnable?: boolean;
  description?: string;
  image?: string;
  presentations: { id: string; name: string; units: number; retailTiers: { minQty: number; price: number }[]; wholesaleTiers: { minQty: number; price: number }[] }[];
}

export function validateProductContent(item: unknown): ProductContent {
  if (!item || typeof item !== 'object') throw new Error('product must be object');
  const c = item as any;
  if (!c.id || !c.name || !c.categoryId) throw new Error('product: id, name, categoryId required');
  if (!Array.isArray(c.presentations) || c.presentations.length === 0) throw new Error('product: presentations required');
  return c as ProductContent;
}
