export interface BrandContent {
  id: string;
  name: string;
  logo?: string;
}

export function validateBrandContent(item: unknown): BrandContent {
  if (!item || typeof item !== 'object') throw new Error('brand must be object');
  const c = item as any;
  if (!c.id || !c.name) throw new Error('brand: id and name required');
  return c as BrandContent;
}
