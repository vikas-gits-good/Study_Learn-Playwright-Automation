const { test } = require("@playwright/test");

test("Browser context test", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://www.aicamp.ai/login");
});

test("Page playwright test", async ({ page }) => {
  await page.goto("https://www.aicamp.ai/login");
});
