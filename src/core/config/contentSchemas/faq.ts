export interface FaqContent {
  id: string;
  question: string;
  answer: string;
}

export function validateFaqContent(item: unknown): FaqContent {
  if (!item || typeof item !== 'object') throw new Error('faq must be object');
  const c = item as any;
  if (!c.id || !c.question || !c.answer) throw new Error('faq: id, question, answer required');
  return c as FaqContent;
}
