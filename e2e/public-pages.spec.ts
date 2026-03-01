import { test, expect } from '@playwright/test';

test.describe('5. Public Pages', () => {
  test('5a. Landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const content = await page.content();
    expect(content.length).toBeGreaterThan(500);
  });

  test('5b. Terms page', async ({ page }) => {
    await page.goto('/terms');
    await page.waitForTimeout(1500);
  });

  test('5c. Privacy page', async ({ page }) => {
    await page.goto('/privacy');
    await page.waitForTimeout(1500);
  });

  test('5d. Cookies page', async ({ page }) => {
    await page.goto('/cookies');
    await page.waitForTimeout(1500);
  });

  test('5e. Complaints page', async ({ page }) => {
    await page.goto('/complaints');
    await page.waitForTimeout(1500);
  });

  test('5f. Contact page', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForTimeout(1500);
  });

  test('5g. API Health check', async ({ page }) => {
    const baseUrl = page.url().includes('localhost')
      ? 'http://localhost:4000'
      : 'https://fansbookrebuild.byredstone.com';
    const response = await page.request.get(`${baseUrl}/api/health`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.database).toBe('connected');
  });
});
