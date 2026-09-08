// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://playwright.dev/');
});

test('verify title & URL', async ({ page }) => {
  await expect(page).toHaveTitle(/Playwright/);
  await expect(page).toHaveURL('https://playwright.dev/');
});

test('locate & click "Get Started" button using getByRole()', async ({ page }) => {
  await page.getByRole('link', { name: 'Get started' }).click();

  await expect(page).toHaveURL(/.*docs\/intro/);
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('validate text using getByText()', async ({ page }) => {
  await expect(
    page.getByText('Playwright enables reliable web automation for testing, scripting, and AI agents.')
  ).toBeVisible();
});

test('interact with search input using getByPlaceholder()', async ({ page }) => {
  await page.getByRole('button', { name: /Search/ }).click();

  const searchInput = page.getByPlaceholder('Search docs');
  await expect(searchInput).toBeVisible();

  await searchInput.fill('locators');
  await expect(searchInput).toHaveValue('locators');
});

test('verify image using getByAltText()', async ({ page }) => {
  await expect(page.getByAltText('Playwright logo')).toBeVisible();
});

test('find elements using getByTitle(), getByTestId(), $$(), XPath & CSS selectors', async ({ page }) => {
  // getByTitle() - the light/dark mode toggle button exposes a title attribute
  await expect(page.getByTitle('system mode')).toBeVisible();

  // getByTestId() - playwright.dev ships no data-testid attributes, so one is
  // added to the logo for this demo
  await page.locator('.navbar__logo').evaluate((el) => el.setAttribute('data-testid', 'navbar-logo'));
  await expect(page.getByTestId('navbar-logo')).toBeVisible();

  // page.$$() - legacy ElementHandle API to grab all navbar links at once
  const navLinks = await page.$$('.navbar__inner a');
  expect(navLinks.length).toBeGreaterThan(0);

  // XPath selector
  await expect(page.locator('xpath=//h1')).toHaveText(
    'Playwright enables reliable web automation for testing, scripting, and AI agents.'
  );

  // CSS selector
  await expect(page.locator('css=.navbar__logo img')).toBeVisible();
});
