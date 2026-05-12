import { expect, test, type Page } from "@playwright/test";

async function unlockDemo(page: Page) {
  await page.goto("/login");
  await page.getByLabel(/demo access code/i).fill("anden-demo");
  await page.getByRole("button", { name: /unlock demo/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test("assistant answers golden prompts with citations, legal warning, and knowledge gaps", async ({
  page
}) => {
  await unlockDemo(page);
  await page.goto("/assistant");

  await expect(
    page.getByRole("heading", { name: /ai knowledge assistant/i })
  ).toBeVisible();

  await page
    .getByRole("button", { name: /what is anden's value proposition/i })
    .click();
  await expect(page.getByText(/internal AI backoffice/i)).toBeVisible();
  await expect(page.getByText(/And[eé]n Value Proposition/i)).toBeVisible();
  await expect(page.getByText(/Operational inference/i)).toBeVisible();

  await page
    .getByRole("button", {
      name: /summarize the requirements for a company/i
    })
    .click();
  await expect(page.getByText("Legal review", { exact: true })).toBeVisible();
  await expect(page.getByText(/Original language: Spanish/i).first()).toBeVisible();

  await page
    .getByLabel(/ask anden os/i)
    .fill("Does Anden guarantee payroll tax refunds in Brazil?");
  await page.getByRole("button", { name: /^ask$/i }).click();
  await expect(page.getByText(/knowledge gap/i)).toBeVisible();
  await expect(page.getByText(/not have enough indexed/i)).toBeVisible();
});
