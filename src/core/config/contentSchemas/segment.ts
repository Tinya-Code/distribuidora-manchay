export interface SegmentContent {
  id: string;
  name: string;
  description?: string;
  suggestedProducts?: string[];
}

export function validateSegmentContent(item: unknown): SegmentContent {
  if (!item || typeof item !== 'object') throw new Error('segment must be object');
  const c = item as any;
  if (!c.id || !c.name) throw new Error('segment: id and name required');
  return c as SegmentContent;
}
