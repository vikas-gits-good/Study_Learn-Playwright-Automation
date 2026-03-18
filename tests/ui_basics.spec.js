const { test, expect } = require("@playwright/test");

test("Browser context test", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://www.aicamp.ai/login");
});

test.only("Page playwright test", async ({ page }) => {
  await page.goto("https://www.aicamp.ai/login");
  const title = await page.title();
  console.log(title);
  await expect(page).toHaveTitle(
    "Learn AI with global developers community | AICamp",
  );
  await page
    .getByRole("textbox", { name: "Email Address" })
    .fill(process.env.TEST_USER || "");
  await page.waitForTimeout(500);
  await page
    .getByRole("textbox", { name: "password or one time password" })
    .fill(process.env.TEST_PSWD || "");
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForEvent("load");
});
