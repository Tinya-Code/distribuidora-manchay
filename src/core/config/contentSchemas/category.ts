export interface CategoryContent {
  id: string;
  name: string;
  parentId?: string;
  order?: number;
  image?: string;
  description?: string;
}

export function validateCategoryContent(item: unknown): CategoryContent {
  if (!item || typeof item !== 'object') throw new Error('category must be object');
  const c = item as any;
  if (!c.id || !c.name) throw new Error('category: id and name required');
  return c as CategoryContent;
}
