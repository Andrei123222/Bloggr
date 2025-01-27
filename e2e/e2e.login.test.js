//npx playwright test e2e
require('dotenv').config();
const { test, expect } = require('@playwright/test');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



test('E2E Login Test', async ({ page }) => {
  await page.goto('http://localhost:5000/admin'); // Replace with your app's URL
  await page.fill('input[name="username"]', 'Ade');
  await page.fill('input[name="password"]', 'deidei');
  await page.click('input[type="submit"]');

  const cookies = await page.context().cookies();
  const tokenCookie = cookies.find(cookie => cookie.name === 'token');

  expect(tokenCookie).toBeDefined();

  const decodedToken = jwt.verify(tokenCookie.value, process.env.jwtSecret);

  expect(decodedToken).toHaveProperty('userId');
  expect(decodedToken).toHaveProperty('username');
  expect(decodedToken.username).toBe('Ade');

  await expect(page).toHaveURL(/.*dashboard/);
});

test('Measure home load performance', async ({ page }) => {
  // Start timing
  const start = Date.now();

  // Navigate to the page
  await page.goto('http://localhost:5000');

  // Wait for the page to fully load
  await page.waitForLoadState('load');

  // End timing
  const end = Date.now();

  // Log load time
  console.log(`Page load time: ${end - start}ms`);

  // Collect Performance Timing Metrics
  const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );

  const pageLoadTime =
    performanceTiming.loadEventEnd - performanceTiming.navigationStart;

  console.log(`Navigation Start to Load Event End: ${pageLoadTime}ms`);

  expect(pageLoadTime).toBeLessThan(2000); // Set your acceptable threshold
});