import { expect, test, type Page } from "@playwright/test";

async function unlockDemo(page: Page) {
  await page.goto("/login");
  await page.getByLabel(/demo access code/i).fill("anden-demo");
  await page.getByRole("button", { name: /unlock demo/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test("workflow simulations generate outputs with citations and run history", async ({
  page
}) => {
  await unlockDemo(page);
  await page.goto("/workflows");

  await expect(page.getByRole("heading", { name: "Workflows" })).toBeVisible();

  await page
    .getByRole("button", { name: /run company onboarding/i })
    .click();
  await expect(page.getByText(/AtlasPay should enter/i)).toBeVisible();
  await expect(page.getByText(/Incorporation documents/i)).toBeVisible();
  await expect(page.getByText(/Legal review required/i).first()).toBeVisible();
  await expect(page.getByText(/Digital Zone Company Onboarding FAQ/i)).toBeVisible();

  await page.getByRole("button", { name: /run prepare meeting/i }).click();
  await expect(page.getByText(/Civitas Cloud meeting brief/i)).toBeVisible();
  await expect(page.getByText(/suggested questions/i)).toBeVisible();
  await expect(page.getByText(/follow-up email/i)).toBeVisible();

  await page
    .getByRole("button", { name: /run publish institutional content/i })
    .click();
  await expect(page.getByText(/Operating problem/i)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /seo metadata/i })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /linkedin post/i })
  ).toBeVisible();
  await expect(page.getByText(/Run history/i)).toBeVisible();
  await expect(page.getByText(/Completed \/ 100%/i).first()).toBeVisible();
});
