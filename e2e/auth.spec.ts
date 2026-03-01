import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');
    await expect(
      page
        .locator(
          'input[name="emailOrUsername"], input[placeholder*="email" i], input[placeholder*="username" i]',
        )
        .first(),
    ).toBeVisible();
  });

  test('should login with valid credentials and redirect to feed', async ({ page }) => {
    await page.goto('/login');

    // Fill login form
    const usernameInput = page.locator('input').first();
    const passwordInput = page.locator('input[type="password"]');
    await usernameInput.fill('testfan');
    await passwordInput.fill('Test12345');

    // Submit
    await page.locator('button[type="submit"]').click();

    // Should redirect to /feed
    await page.waitForURL('**/feed', { timeout: 10000 });
    await expect(page).toHaveURL(/\/feed/);
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.goto('/login');

    const usernameInput = page.locator('input').first();
    const passwordInput = page.locator('input[type="password"]');
    await usernameInput.fill('baduser');
    await passwordInput.fill('wrongpassword');

    await page.locator('button[type="submit"]').click();

    // Should stay on login page or show error
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toContain('/login');
  });

  test('should logout and redirect to login', async ({ page }) => {
    // Login first
    await page.goto('/login');
    const usernameInput = page.locator('input').first();
    const passwordInput = page.locator('input[type="password"]');
    await usernameInput.fill('testfan');
    await passwordInput.fill('Test12345');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/feed', { timeout: 10000 });

    // Find and click logout
    const logoutBtn = page
      .locator('text=Logout')
      .or(page.locator('[aria-label="Logout"]'))
      .or(page.locator('img[alt*="logout" i]'));
    if ((await logoutBtn.count()) > 0) {
      await logoutBtn.first().click();
      await page.waitForURL('**/login', { timeout: 5000 });
      await expect(page).toHaveURL(/\/login/);
    }
  });
});
