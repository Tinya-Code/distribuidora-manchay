export type Brand<T, B extends string> = T & { readonly __brand: B };

export type ProductId = Brand<string, 'ProductId'>;
export type PresentationId = Brand<string, 'PresentationId'>;
export type ZoneId = Brand<string, 'ZoneId'>;
export type CategoryId = Brand<string, 'CategoryId'>;
export type BrandId = Brand<string, 'BrandId'>;
export type SegmentId = Brand<string, 'SegmentId'>;

export function asProductId(value: string): ProductId {
  return value as ProductId;
}
export function asPresentationId(value: string): PresentationId {
  return value as PresentationId;
}
export function asZoneId(value: string): ZoneId {
  return value as ZoneId;
}
export function asCategoryId(value: string): CategoryId {
  return value as CategoryId;
}
export function asBrandId(value: string): BrandId {
  return value as BrandId;
}
export function asSegmentId(value: string): SegmentId {
  return value as SegmentId;
}
