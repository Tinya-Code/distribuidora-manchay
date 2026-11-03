import { products, categories, zones, brands, segments, reviews, faqs, pages, business } from '@tenant/data';

describe('Tenant data (JSON)', () => {
  it('loads business', () => {
    expect(business.identity.name).toBe('Distribuidora Pachacámac');
  });
  it('loads categories', () => {
    expect(categories.length).toBeGreaterThanOrEqual(9);
  });
  it('loads products', () => {
    expect(products.length).toBeGreaterThanOrEqual(8);
  });
  it('loads zones', () => {
    expect(zones.length).toBeGreaterThanOrEqual(3);
  });
  it('loads brands, segments, reviews, faqs, pages', () => {
    expect(brands.length).toBeGreaterThanOrEqual(2);
    expect(segments.length).toBeGreaterThanOrEqual(4);
    expect(reviews.length).toBeGreaterThanOrEqual(3);
    expect(faqs.length).toBeGreaterThanOrEqual(5);
    expect(pages.length).toBeGreaterThanOrEqual(3);
  });
  it('product has presentations with tiers', () => {
    const p = products.find((x: any) => x.id === 'prod_gaseosa_500')!;
    expect(p).toBeDefined();
    expect(p.presentations.length).toBeGreaterThanOrEqual(2);
  });
});
