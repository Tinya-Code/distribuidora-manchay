export interface FeaturesConfig {
  cart: boolean;
  checkout: boolean;
  quote: boolean;
  businessHours: boolean;
  consumptionCalculator: boolean;
  quickOrder: boolean;
}

export function validateFeaturesConfig(config: unknown): FeaturesConfig {
  if (!config || typeof config !== 'object') throw new Error('features config must be an object');
  const c = config as any;
  const bool = (v: any) => typeof v === 'boolean';
  if (!bool(c.cart)) throw new Error('features.cart must be boolean');
  return c as FeaturesConfig;
}
