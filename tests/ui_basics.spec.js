const { test, expect } = require("@playwright/test");

test("Test screener login", async ({ browser }) => {
  test.setTimeout(120_000);
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(process.env.TEST_URLS || "");
  await page
    .getByRole("textbox", { name: "Email" })
    .fill(process.env.TEST_USER || "");
  await page.waitForTimeout(500);
  await page
    .getByRole("textbox", { name: "Password" })
    .fill(process.env.TEST_PSWD || "");
  await page.waitForTimeout(500);

  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForLoadState("load");

  const searchBox = page.locator(
    "//div[@id='desktop-search']//input[@placeholder='Search for a company']",
  );
  await searchBox.click();
  await searchBox.fill(process.env.TEST_USER || "");
  await page.waitForTimeout(500);
  await page.keyboard.press("Enter");
  await page.waitForURL("**/company/**");

  const selector =
    'button[onclick*="Company.showSchedule"]:visible, button[onclick*="Company.showShareholders"]:visible';

  const seen = new Set();
  const maxIterations = 50;

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const buttons = page.locator(selector);
    const count = await buttons.count();
    let clicked = false;

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const onclick = await button.getAttribute("onclick");

      if (!onclick || seen.has(onclick)) continue;

      seen.add(onclick);
      await button.scrollIntoViewIfNeeded();
      await Promise.all([page.waitForLoadState("networkidle"), button.click()]);
      await page.waitForTimeout(1500);
      clicked = true;
      break;
    }

    if (!clicked) break;
  }
});
