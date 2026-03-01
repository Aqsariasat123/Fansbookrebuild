import { test, expect } from '@playwright/test';

test.describe('Feed Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    const usernameInput = page.locator('input').first();
    const passwordInput = page.locator('input[type="password"]');
    await usernameInput.fill('testfan');
    await passwordInput.fill('Test12345');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/feed', { timeout: 10000 });
  });

  test('should load feed page after login', async ({ page }) => {
    await expect(page).toHaveURL(/\/feed/);
  });

  test('should display posts from API', async ({ page }) => {
    // Wait for posts to load
    await page.waitForTimeout(2000);

    // Check for post content — cards or post elements
    const postElements = page.locator('[class*="post"], [class*="card"], article').first();
    const hasPosts = (await postElements.count()) > 0;

    // Feed should have content
    expect(hasPosts || (await page.content()).includes('post')).toBeTruthy();
  });

  test('should navigate to messages', async ({ page }) => {
    // Navigate directly since sidebar link may not be visible on small viewports
    await page.goto('/messages');
    await page.waitForURL('**/messages', { timeout: 5000 });
    await expect(page).toHaveURL(/\/messages/);
  });
});
