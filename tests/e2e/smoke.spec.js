import { test, expect } from '@playwright/test';

test('smoke test - home page loads correctly', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/OK Express/);

    // Check for critical elements
    // Logo - Adjust selector for React
    // await expect(page.locator('img[alt="Logo"]')).toBeVisible();

    // CTA Button
    // await expect(page.locator('text=Calcule seu Frete')).toBeVisible();
});
