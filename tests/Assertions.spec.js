// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
});

test('login page - URL, Title, Visibility, Enabled & Attribute assertions', async ({ page }) => {
  // URL assertion
  await expect(page).toHaveURL(BASE_URL);

  // Title assertion
  await expect(page).toHaveTitle('Swag Labs');

  // Visibility assertions
  await expect(page.locator('.login-box')).toBeVisible();
  await expect(page.locator('#login-button')).toBeVisible();

  // Negative assertion - error banner must not be visible before a bad login attempt
  await expect(page.locator('[data-test="error"]')).not.toBeVisible();

  // Enabled/Disabled assertion
  await expect(page.locator('#login-button')).toBeEnabled();

  // Attribute assertions
  await expect(page.locator('#password')).toHaveAttribute('type', 'password');
  await expect(page.locator('#user-name')).toHaveAttribute('placeholder', 'Username');
});

test('invalid login - soft assertions & a negative assertion', async ({ page }) => {
  await page.locator('#user-name').fill('locked_out_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  const errorMessage = page.locator('[data-test="error"]');

  // Soft assertions - all run and are reported together, execution continues even if one fails
  await expect.soft(errorMessage).toBeVisible();
  await expect.soft(errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  await expect.soft(errorMessage).toContainText('lockhed out');
  console.log("Soft assert test failure (expected for demo purpose) invalid login - soft assertions & a negative assertion")
  // Hard, negative assertion - a locked out user must never reach the inventory page
  await expect(page).not.toHaveURL(/inventory\.html/);
  console.log("Test completed even after a failure, since tagged as soft assert");
});

test.describe('inventory page (logged in)', () => {
  test.beforeEach(async ({ page }) => {
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await page.waitForURL('**/inventory.html');
  });

  test('URL, Title, Text & Count assertions', async ({ page }) => {
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page).toHaveTitle('Swag Labs');

    // Text assertion
    await expect(page.locator('.title')).toHaveText('Products');

    // Count assertion
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('sort dropdown - Attribute & Value assertions', async ({ page }) => {
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    console.log("eg ",sortDropdown);
    // Attribute assertion
    await expect(sortDropdown).toHaveAttribute('data-test', 'product-sort-container');

    // Value assertion
    await sortDropdown.selectOption('za');
    await expect(sortDropdown).toHaveValue('za');

    // Text assertion - confirms the Z-to-A sort actually reordered the list
    await expect(page.locator('.inventory_item_name').first()).toHaveText('Test.allTheThings() T-Shirt (Red)');
  });

  test('add to cart - Enabled/Disabled, Text & Count assertions', async ({ page }) => {
    const addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    const addToCartButton2 = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');

    await expect(addToCartButton).toBeEnabled();
    await expect(addToCartButton).toHaveText('Add to cart');

    // Negative count assertion - cart badge does not exist while the cart is empty
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

    await addToCartButton.click();

    const removeButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    await expect(removeButton).toBeVisible();
    await expect(removeButton).toHaveText('Remove');

    await addToCartButton2.click();
    

    await expect(page.locator('.shopping_cart_badge')).toHaveText('2'); //compares text content on the icon
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(1); //compares how many element locators are present on the page
  });

});
