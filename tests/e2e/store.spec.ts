import { test, expect } from '@playwright/test';

test.describe('Store flow', () => {
  test('home loads with title and navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').filter({ hasText: /Distribuidora/ })).toBeVisible();
  });

  test('catalog shows products', async ({ page }) => {
    await page.goto('/catalogo');
    await expect(page.locator('h1').filter({ hasText: 'Catálogo' })).toBeVisible();
    // Esperar a que render() cree las tarjetas de producto
    await page.locator('.product-card').first().waitFor({ state: 'visible', timeout: 10000 });
    const cards = page.locator('.product-card');
    await expect(cards.first()).toBeVisible();
  });

  test('product page renders with price', async ({ page }) => {
    await page.goto('/producto/bidon-agua-20-litros');
    await expect(page.locator('h1').filter({ hasText: 'Bidón' })).toBeVisible();
    await expect(page.locator('text=Precios por volumen')).toBeVisible();
  });

  test('add to cart from catalog updates counter', async ({ page }) => {
    await page.goto('/catalogo');
    await page.locator('.product-card').first().waitFor({ state: 'visible', timeout: 10000 });
    const addBtn = page.locator('button[data-add-to-cart]').first();
    await addBtn.click();
    await expect(page.locator('#cart-count')).toHaveText('1', { timeout: 8000 });
  });

  test('cart page shows line items', async ({ page }) => {
    await page.goto('/catalogo');
    await page.locator('.product-card').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('button[data-add-to-cart]').first().click();
    await page.goto('/carrito');
    await expect(page.locator('[data-line]').first()).toBeVisible();
  });

  test('quote form renders', async ({ page }) => {
    await page.goto('/cotizar');
    await expect(page.locator('h1')).toContainText('cotización');
    await expect(page.locator('#quote-form')).toBeVisible();
  });

  test('zones list renders', async ({ page }) => {
    await page.goto('/zonas');
    await expect(page.locator('h1')).toContainText('Zonas');
  });

  test('negocios page has quick order table', async ({ page }) => {
    await page.goto('/negocios');
    await expect(page.locator('#qo-table')).toBeVisible();
  });

  test('sitemap.xml is served', async ({ page }) => {
    const res = await page.request.get('/sitemap.xml');
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('/producto/');
  });
});
