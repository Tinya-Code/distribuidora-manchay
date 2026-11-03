export interface ZoneContent {
  id: string;
  name: string;
  shippingCost: number;
  freeShippingFrom?: number;
  minOrder: number;
  deliveryTime: string;
  deliveryDays: number[];
}

export function validateZoneContent(item: unknown): ZoneContent {
  if (!item || typeof item !== 'object') throw new Error('zone must be object');
  const c = item as any;
  if (!c.id || !c.name) throw new Error('zone: id and name required');
  if (typeof c.minOrder !== 'number') throw new Error('zone: minOrder must be number');
  return c as ZoneContent;
}
