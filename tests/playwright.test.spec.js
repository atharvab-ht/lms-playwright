// @ts-check
import { test, expect } from '@playwright/test';


test('homepage URL', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await expect(page).toHaveURL('https://playwright.dev/');
  
  await page.waitForTimeout(3000);
});

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);

  await page.waitForTimeout(3000);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();

  await page.waitForTimeout(3000);
});

