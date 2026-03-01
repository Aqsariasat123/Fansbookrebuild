import { test, expect, Page } from '@playwright/test';
import { ADMIN_USER, ADMIN_PASS, SLOW } from './helpers';

test.describe.configure({ mode: 'serial' });

test.describe('4. Admin Panel', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });
  test.afterAll(async () => {
    await page.close();
  });

  test('4a. Admin login page loads', async () => {
    await page.goto('/admin/login');
    await page.waitForTimeout(1500);
    await expect(page.locator('input').first()).toBeVisible();
  });

  test('4b. Login as admin', async () => {
    const usernameInput = page.getByPlaceholder(/email|username|admin/i).first();
    const passwordInput = page.locator('input[type="password"]').first();
    if (await usernameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await usernameInput.click();
      await usernameInput.fill(ADMIN_USER);
    } else {
      await page.locator('input').first().fill(ADMIN_USER);
    }
    await page.waitForTimeout(SLOW);
    await passwordInput.click();
    await passwordInput.fill(ADMIN_PASS);
    await page.waitForTimeout(SLOW);
    await page.getByRole('button', { name: /login|sign/i }).click();
    await page.waitForTimeout(5000);
    expect(page.url()).toMatch(/\/admin/);
  });

  test('4c. Admin Dashboard', async () => {
    await page.goto('/admin/dashboard');
    await page.waitForTimeout(3000);
    const content = await page.content();
    expect(content.length).toBeGreaterThan(1000);
  });

  test('4d. Admin Users', async () => {
    await page.goto('/admin/users');
    await page.waitForTimeout(2000);
  });

  test('4e. Admin Creators', async () => {
    await page.goto('/admin/creators');
    await page.waitForTimeout(2000);
  });

  test('4f. Admin FAQs', async () => {
    await page.goto('/admin/faqs');
    await page.waitForTimeout(2000);
    const addBtn = page.getByRole('button', { name: /add|create|new/i }).first();
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1500);
      const modal = page.locator('[role="dialog"], [class*="modal" i]').first();
      if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
        const inputs = modal.locator('input, textarea');
        const count = await inputs.count();
        if (count >= 1) await inputs.nth(0).fill('E2E Test Question?');
        if (count >= 2) await inputs.nth(1).fill('E2E Test Answer.');
        const saveBtn = modal.getByRole('button', { name: /save|create|submit/i }).first();
        if (await saveBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await saveBtn.click();
          await page.waitForTimeout(2000);
        }
      }
    }
  });

  test('4g. Admin CMS', async () => {
    await page.goto('/admin/cms');
    await page.waitForTimeout(2000);
  });

  test('4h. Admin Email Templates', async () => {
    await page.goto('/admin/email-templates');
    await page.waitForTimeout(2000);
  });

  test('4i. Admin Countries', async () => {
    await page.goto('/admin/countries');
    await page.waitForTimeout(2000);
  });

  test('4j. Admin Subscription Plans', async () => {
    await page.goto('/admin/subscription-plans');
    await page.waitForTimeout(2000);
  });

  test('4k. Admin Audit Log', async () => {
    await page.goto('/admin/audit-log');
    await page.waitForTimeout(2000);
    const content = await page.content();
    expect(content.length).toBeGreaterThan(500);
  });

  test('4l. Admin Platforms', async () => {
    await page.goto('/admin/platforms');
    await page.waitForTimeout(2000);
  });

  test('4m. Admin Translations', async () => {
    await page.goto('/admin/translations');
    await page.waitForTimeout(2000);
  });

  test('4n. Admin Profile Types', async () => {
    await page.goto('/admin/profile-types');
    await page.waitForTimeout(2000);
  });

  test('4o. Admin Profile Stat Types', async () => {
    await page.goto('/admin/profile-stat-types');
    await page.waitForTimeout(2000);
  });

  test('4p. Admin Profile Stats', async () => {
    await page.goto('/admin/profile-stats');
    await page.waitForTimeout(2000);
  });

  test('4q. Admin Country Forms', async () => {
    await page.goto('/admin/country-forms');
    await page.waitForTimeout(2000);
  });

  test('4r. Admin Settings', async () => {
    await page.goto('/admin/settings');
    await page.waitForTimeout(2000);
  });

  test('4s. Admin Reports', async () => {
    await page.goto('/admin/reports');
    await page.waitForTimeout(2000);
  });

  test('4t. Admin Withdrawals', async () => {
    await page.goto('/admin/withdrawals');
    await page.waitForTimeout(2000);
  });
});
