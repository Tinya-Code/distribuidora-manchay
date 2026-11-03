import { Cart, Product, Presentation, PriceTier, PriceList, Money, asProductId, asPresentationId, asCategoryId, asZoneId, DeliveryZone, Business, BusinessHours, TierPricingStrategy, PricingService } from '@core/domain';
import { CatalogSource, OrderGateway, MessageFormatter, MessageChannel, CodeGenerator, Clock, LastOrderStorage, Analytics } from '@core/application';
import { SubmitOrder } from '@core/application';
import { Result } from '@core/domain';

describe('SubmitOrder', () => {
  const retail = new PriceList('retail', [new PriceTier(1, new Money(2.5))]);
  const wholesale = new PriceList('wholesale', [new PriceTier(1, new Money(2.0))]);
  const pres = new Presentation({ id: asPresentationId('pres1'), name: 'Botella', units: 1, retailPrices: retail, wholesalePrices: wholesale });
  const product = new Product({ id: asProductId('prod1'), name: 'Agua', categoryId: asCategoryId('cat'), presentations: [pres] });
  const zone = new DeliveryZone({ id: asZoneId('z1'), name: 'Zona', shippingCost: new Money(5), minOrder: new Money(1), deliveryTime: '24h', deliveryDays: [1] });

  const catalog: CatalogSource = {
    products: () => [product],
    categories: () => [],
    zones: () => [zone],
  };
  const failingGateway: OrderGateway = {
    send: async () => ({ ok: false, error: 'boom' }) as any,
  };
  const formatter: MessageFormatter = {
    formatOrder: () => 'hello order',
    formatQuote: () => 'quote',
  };
  const channel: MessageChannel = {
    buildLink: (m) => `https://wa.me/?text=${encodeURIComponent(m)}`,
  };
  const codeGen: CodeGenerator = {
    generateOrderCode: () => ({ value: 'PED-261102-K7F3', toString: () => 'PED-261102-K7F3' } as any),
    generateQuoteCode: () => ({ value: 'COT-261102-A9X2' } as any),
  };
  const clock: Clock = { now: () => new Date('2026-11-02T10:00:00') };
  const lastOrder: LastOrderStorage = { load: () => null, save: () => {}, clear: () => {} };
  const analytics: Analytics = { track: () => {} };
  const business = new Business({
    name: 'Negocio',
    phone: '999',
    whatsapp: '999',
    address: 'Dir',
    hours: new BusinessHours({ openTime: '07:00', closeTime: '19:00', days: [1,2,3,4,5] }),
  });

  it('generates whatsapp link even if API fails', async () => {
    const cart = new Cart();
    cart.add(asProductId('prod1'), asPresentationId('pres1'), 2);
    const pricing = new PricingService(new TierPricingStrategy());
    const uc = new SubmitOrder(cart, catalog, pricing, failingGateway, formatter, channel, codeGen as any, clock, lastOrder, analytics, business);
    const res = await uc.execute({
      zoneId: 'z1',
      address: 'Av X',
      customerName: 'Juan',
      customerPhone: '999',
      customerType: 'home',
      paymentMethod: 'cash',
      invoice: 'boleta',
      pricingMode: 'home',
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value.whatsappLink).toContain('wa.me');
      expect(res.value.order).toBeDefined();
    }
  });
});
