import { Money, PriceTier, PriceList, Presentation, asPresentationId, asProductId, asCategoryId, TierPricingStrategy, PricingService, PricingMode } from '@core/domain';

describe('Pricing tiers', () => {
  const retail = new PriceList('retail', [
    new PriceTier(1, new Money(2.5)),
    new PriceTier(6, new Money(2.2)),
    new PriceTier(12, new Money(2.0)),
  ]);
  const wholesale = new PriceList('wholesale', [
    new PriceTier(1, new Money(2.0)),
    new PriceTier(24, new Money(1.8)),
  ]);
  const pres = new Presentation({
    id: asPresentationId('p1'),
    name: 'Botella 600ml',
    units: 1,
    retailPrices: retail,
    wholesalePrices: wholesale,
  });

  it('applies tier price', () => {
    const svc = new PricingService(new TierPricingStrategy());
    expect(svc.unitPrice(pres, 1, 'home').amount).toBe(2.5);
    expect(svc.unitPrice(pres, 6, 'home').amount).toBe(2.2);
    expect(svc.unitPrice(pres, 12, 'home').amount).toBe(2.0);
  });
  it('line total', () => {
    const svc = new PricingService(new TierPricingStrategy());
    expect(svc.lineTotal(pres, 6, 'home').amount).toBe(13.2);
  });
  it('next tier', () => {
    const svc = new PricingService(new TierPricingStrategy());
    const nt = svc.nextTier(pres, 3, 'home');
    expect(nt?.minQty).toBe(6);
  });
  it('savings to next tier', () => {
    const svc = new PricingService(new TierPricingStrategy());
    const savings = svc.savingsToNextTier(pres, 3, 'home');
    expect(savings.amount).toBeGreaterThan(0);
  });
});
