export type BusinessType = 'store' | 'restaurant' | 'office' | 'event';
export type BusinessSize = 'small' | 'medium' | 'large';

export interface ConsumptionInput {
  businessType: BusinessType;
  size: BusinessSize;
}

export interface ConsumptionItem {
  readonly category: string;
  readonly quantity: number;
}

const SIZE_MULTIPLIER: Record<BusinessSize, number> = {
  small: 1,
  medium: 2,
  large: 4,
};

const BASE: Record<BusinessType, { category: string; qty: number }[]> = {
  store: [
    { category: 'water-600ml', qty: 24 },
    { category: 'water-1l', qty: 12 },
    { category: 'soda-2l', qty: 6 },
  ],
  restaurant: [
    { category: 'water-600ml', qty: 48 },
    { category: 'soda-1.5l', qty: 12 },
  ],
  office: [
    { category: 'water-20l', qty: 2 },
    { category: 'water-600ml', qty: 24 },
  ],
  event: [
    { category: 'water-600ml', qty: 60 },
    { category: 'soda-2l', qty: 24 },
  ],
};

export class ConsumptionCalculator {
  suggest(input: ConsumptionInput): ConsumptionItem[] {
    const mult = SIZE_MULTIPLIER[input.size] ?? 1;
    const base = BASE[input.businessType] ?? [];
    return base.map((b) => ({ category: b.category, quantity: b.qty * mult }));
  }
}
