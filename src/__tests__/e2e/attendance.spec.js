import { test, expect } from '@playwright/test';

test.describe('Attendance Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('should create attendance sheet', async ({ page }) => {
    await page.click('text=Create Attendance');
    await page.selectOption('select[name="month"]', 'January');
    await page.selectOption('select[name="year"]', '2026');
    await page.click('button:has-text("Create")');
    await expect(page.locator('text=Attendance sheet created')).toBeVisible();
  });

  test('should mark attendance', async ({ page }) => {
    await page.click('table td:first-child');
    await page.click('text=Present');
    await expect(page.locator('td:has-text("P")')).toBeVisible();
  });

  test('should calculate salary', async ({ page }) => {
    await page.click('text=Salary Management');
    await page.waitForSelector('table');
    const netSalary = await page.locator('td:has-text("Net Salary")').textContent();
    expect(netSalary).toBeTruthy();
  });
});
