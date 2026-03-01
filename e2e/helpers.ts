import { Page } from '@playwright/test';

export const SLOW = 500;
export const CREATOR_USER = 'miamokala';
export const CREATOR_PASS = 'Password@123';
export const ADMIN_USER = 'admin';
export const ADMIN_PASS = 'Admin@1234';

const ts = Date.now();
export const NEW_USER = `testfan_${ts}`;
export const NEW_EMAIL = `testfan_${ts}@test.com`;
export const NEW_PASS = 'Test12345';

export async function login(page: Page, username: string, password: string) {
  await page.goto('/login');
  await page.waitForTimeout(1500);
  await page
    .getByPlaceholder(/email|username/i)
    .first()
    .click();
  await page
    .getByPlaceholder(/email|username/i)
    .first()
    .fill(username);
  await page.waitForTimeout(SLOW);
  await page
    .getByPlaceholder(/password/i)
    .first()
    .click();
  await page
    .getByPlaceholder(/password/i)
    .first()
    .fill(password);
  await page.waitForTimeout(SLOW);
  await page.getByRole('button', { name: /login/i }).click();
  await page.waitForURL('**/feed', { timeout: 20000 });
}
