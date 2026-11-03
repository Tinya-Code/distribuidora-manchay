import { Product, Category, DeliveryZone, Money, asProductId, asCategoryId, asZoneId, asPresentationId, Presentation, PriceList, PriceTier } from '../../domain';

export function toCategory(raw: any): Category {
  return new Category({
    id: asCategoryId(String(raw.id)),
    name: String(raw.name),
    parentId: raw.parentId ? asCategoryId(String(raw.parentId)) : undefined,
    order: raw.order ?? 0,
    image: raw.image,
    description: raw.description,
  });
}

export function toProduct(raw: any): Product {
  return new Product({
    id: asProductId(String(raw.id)),
    name: String(raw.name),
    categoryId: asCategoryId(String(raw.categoryId)),
    presentations: (raw.presentations ?? []).map((p: any) => new Presentation({
      id: asPresentationId(String(p.id)),
      name: String(p.name),
      units: Number(p.units ?? 1),
      retailPrices: new PriceList('retail', (p.retailTiers ?? []).map((t: any) => new PriceTier(Number(t.minQty), new Money(Number(t.price))))),
      wholesalePrices: new PriceList('wholesale', (p.wholesaleTiers ?? []).map((t: any) => new PriceTier(Number(t.minQty), new Money(Number(t.price))))),
    })),
    available: raw.available ?? true,
    featured: raw.featured ?? false,
    returnable: raw.returnable ?? false,
    description: raw.description,
    image: raw.image,
  });
}

export function toZone(raw: any): DeliveryZone {
  return new DeliveryZone({
    id: asZoneId(String(raw.id)),
    name: String(raw.name),
    shippingCost: new Money(Number(raw.shippingCost ?? 0)),
    freeShippingFrom: raw.freeShippingFrom !== undefined ? new Money(Number(raw.freeShippingFrom)) : undefined,
    minOrder: new Money(Number(raw.minOrder ?? 0)),
    deliveryTime: String(raw.deliveryTime ?? ''),
    deliveryDays: raw.deliveryDays ?? [],
  });
}
