export interface PageContent {
  slug: string;
  title: string;
  body: string;
}

export function validatePageContent(item: unknown): PageContent {
  if (!item || typeof item !== 'object') throw new Error('page must be object');
  const c = item as any;
  if (!c.slug || !c.title) throw new Error('page: slug and title required');
  return c as PageContent;
}
