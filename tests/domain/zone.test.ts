import { Money, DeliveryZone, ZonePolicy, asZoneId } from '@core/domain';

describe('ZonePolicy', () => {
  const zone = new DeliveryZone({
    id: asZoneId('z1'),
    name: 'Zona 1',
    shippingCost: new Money(5),
    freeShippingFrom: new Money(50),
    minOrder: new Money(20),
    deliveryTime: '24h',
    deliveryDays: [1,2,3,4,5],
  });
  const policy = new ZonePolicy();

  it('shipping cost', () => {
    expect(policy.shippingCost(zone, new Money(10)).amount).toBe(5);
    expect(policy.shippingCost(zone, new Money(60)).amount).toBe(0);
  });
  it('meets minimum', () => {
    expect(policy.meetsMinimum(zone, new Money(15))).toBe(false);
    expect(policy.meetsMinimum(zone, new Money(20))).toBe(true);
  });
  it('shortfall', () => {
    expect(policy.shortfallToMinimum(zone, new Money(15)).amount).toBe(5);
  });
});
