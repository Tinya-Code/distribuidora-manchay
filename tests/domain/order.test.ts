import { Money, PriceTier, PriceList, Presentation, Product, asProductId, asPresentationId, asCategoryId, asZoneId, OrderBuilder, Customer, TierPricingStrategy, PricingService, DeliveryZone, OrderCode } from '@core/domain';

describe('OrderBuilder', () => {
  const retail = new PriceList('retail', [new PriceTier(1, new Money(2.5))]);
  const wholesale = new PriceList('wholesale', [new PriceTier(1, new Money(2.0))]);
  const pres = new Presentation({ id: asPresentationId('pres1'), name: 'Botella', units: 1, retailPrices: retail, wholesalePrices: wholesale });
  const product = new Product({ id: asProductId('prod1'), name: 'Agua', categoryId: asCategoryId('cat'), presentations: [pres] });
  const zone = new DeliveryZone({ id: asZoneId('z1'), name: 'Zona', shippingCost: new Money(5), minOrder: new Money(10), deliveryTime: '24h', deliveryDays: [1] });
  const svc = new PricingService(new TierPricingStrategy());

  it('builds order', () => {
    const code = new OrderCode('PED-261102-K7F3');
    const customer = new Customer({ type: 'home', name: 'Juan', phone: '999' });
    const res = OrderBuilder.build({
      code,
      customer,
      cartLines: [{ productId: asProductId('prod1'), presentationId: asPresentationId('pres1'), quantity: 4 }],
      resolveProduct: () => product,
      resolvePresentation: () => pres,
      pricingMode: 'home',
      pricingService: svc,
      zone,
      delivery: { address: 'Av. X 123' },
      payment: { method: 'cash' },
      invoice: 'boleta',
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value.lines.length).toBe(1);
      expect(res.value.total.amount).toBe(10 + 5); // 4*2.5 + 5 shipping? min 10, subtotal 10 ok
    }
  });

  it('fails empty cart', () => {
    const code = new OrderCode('PED-261102-K7F3');
    const customer = new Customer({ type: 'home', name: 'Juan', phone: '999' });
    const res = OrderBuilder.build({
      code,
      customer,
      cartLines: [],
      resolveProduct: () => product,
      resolvePresentation: () => pres,
      pricingMode: 'home',
      pricingService: svc,
      zone,
      delivery: { address: 'Av. X 123' },
      payment: { method: 'cash' },
      invoice: 'boleta',
    });
    expect(res.ok).toBe(false);
  });
});
