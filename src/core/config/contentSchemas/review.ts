export interface ReviewContent {
  id: string;
  author: string;
  rating: number;
  text: string;
  date?: string;
}

export function validateReviewContent(item: unknown): ReviewContent {
  if (!item || typeof item !== 'object') throw new Error('review must be object');
  const c = item as any;
  if (!c.id || !c.author || !c.text) throw new Error('review: id, author, text required');
  return c as ReviewContent;
}
