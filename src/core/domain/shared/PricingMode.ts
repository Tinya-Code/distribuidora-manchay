export type PricingMode = 'home' | 'business';
export const PRICING_MODES: readonly PricingMode[] = ['home', 'business'] as const;
export function isPricingMode(value: unknown): value is PricingMode {
  return value === 'home' || value === 'business';
}
