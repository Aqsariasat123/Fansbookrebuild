import { test, expect } from '@playwright/test';

test.describe('Admin Login', () => {
  test('should show admin login page', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('input').first()).toBeVisible();
  });

  test('should redirect unauthenticated admin routes to login', async ({ page }) => {
    await page.goto('/admin/users');
    // Should redirect to login since not authenticated
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toMatch(/\/(admin\/login|login)/);
  });
});
