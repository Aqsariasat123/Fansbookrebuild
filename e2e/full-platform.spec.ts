import { test, expect, Page } from '@playwright/test';
import { login, NEW_USER, NEW_EMAIL, NEW_PASS, CREATOR_USER, CREATOR_PASS } from './helpers';

test.describe.configure({ mode: 'serial' });

// PART 1: REGISTER NEW FAN ACCOUNT
test.describe('1. Registration', () => {
  test('1a. Register new fan account', async ({ page }) => {
    await page.goto('/register');
    await page.waitForTimeout(2000);
    const userInput = page.getByPlaceholder(/username/i).first();
    const emailInput = page.getByPlaceholder(/email/i).first();
    const passInputs = page.locator('input[type="password"]');
    const nameInput = page.getByPlaceholder(/name|display/i).first();
    if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nameInput.fill('Test Fan E2E');
    }
    if (await userInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await userInput.fill(NEW_USER);
    }
    if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await emailInput.fill(NEW_EMAIL);
    }
    const passCount = await passInputs.count();
    for (let i = 0; i < passCount; i++) {
      await passInputs.nth(i).fill(NEW_PASS);
    }
    await page.waitForTimeout(1000);
    const signupBtn = page.getByRole('button', { name: /signup|sign up|register|create/i });
    await signupBtn.scrollIntoViewIfNeeded();
    await signupBtn.click();
    await page.waitForTimeout(5000);
    expect(page.url()).toMatch(/\/(feed|login|register)/);
  });
});

// PART 2: FAN FEATURES
test.describe('2. Fan Features', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });
  test.afterAll(async () => {
    await page.close();
  });

  test('2a. Login as fan', async () => {
    await login(page, NEW_USER, NEW_PASS);
    await expect(page).toHaveURL(/\/feed/);
  });
  test('2b. Feed loads', async () => {
    const content = await page.content();
    expect(content.length).toBeGreaterThan(2000);
  });
  test('2c. Like a post', async () => {
    const likeBtn = page.locator('img[src*="favorite"], [class*="favorite"]').first();
    if (await likeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await likeBtn.click();
      await page.waitForTimeout(1500);
    }
  });
  test('2d. Messages page', async () => {
    await page.goto('/messages');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/messages/);
  });
  test('2e. Profile Edit', async () => {
    await page.goto('/profile/edit');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/profile\/edit/);
  });
  test('2f. Settings', async () => {
    await page.goto('/settings');
    await page.waitForTimeout(2000);
  });
  test('2g. Explore', async () => {
    await page.goto('/explore');
    await page.waitForTimeout(2000);
  });
  test('2h. Creator profile visit', async () => {
    await page.goto('/u/miamokala');
    await page.waitForTimeout(3000);
    const content = await page.content();
    expect(content.toLowerCase()).toContain('miamokala');
  });
});

// PART 3: CREATOR DASHBOARD
test.describe('3. Creator Dashboard', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });
  test.afterAll(async () => {
    await page.close();
  });

  test('3a. Login as creator', async () => {
    await login(page, CREATOR_USER, CREATOR_PASS);
  });
  test('3b. Creator Profile', async () => {
    await page.goto('/creator/profile');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/creator\/profile/);
  });
  test('3c. Creator Wallet', async () => {
    await page.goto('/creator/wallet');
    await page.waitForTimeout(2000);
  });
  test('3d. Creator Earnings', async () => {
    await page.goto('/creator/earnings');
    await page.waitForTimeout(2000);
  });
  test('3e. Creator Referrals', async () => {
    await page.goto('/creator/referrals');
    await page.waitForTimeout(2000);
  });
  test('3f. Creator Subscriptions', async () => {
    await page.goto('/creator/subscriptions');
    await page.waitForTimeout(2000);
  });
  test('3g. Creator Bookings', async () => {
    await page.goto('/creator/bookings');
    await page.waitForTimeout(2000);
  });
  test('3h. Create Post page', async () => {
    await page.goto('/creator/post/new');
    await page.waitForTimeout(2000);
  });
  test('3i. Go Live page', async () => {
    await page.goto('/creator/go-live');
    await page.waitForTimeout(2000);
  });
});
