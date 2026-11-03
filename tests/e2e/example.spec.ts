// Placeholder test to verify Playwright is configured
import { test, expect } from '@playwright/test';

test('placeholder e2e test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.*/);
});
