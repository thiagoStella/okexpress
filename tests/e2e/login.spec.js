import { test, expect } from '@playwright/test';

test('should allow user to login', async ({ page }) => {
    // 1. Go to home page
    await page.goto('/');

    // 2. Check if we are on the home page
    await expect(page).toHaveTitle(/OK Express/);

    // 3. Navigate to login page
    // Login is at root in this app
    // await page.goto('/login');

    // 4. Fill login form
    // Selectors might need adjustment based on React components
    await page.fill('input[placeholder="Ex: atendente"]', 'admin');
    await page.fill('input[placeholder="••••••"]', 'admin');

    // 5. Submit
    await page.click('button[type="submit"]');

    // 6. Verify redirection or success message
    // await expect(page).toHaveURL(/dashboard/);
});
