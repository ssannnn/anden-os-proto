import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function unlockDemo(page: Page) {
  await page.goto("/login");
  await page.getByLabel(/demo access code/i).fill("anden-demo");
  await page.getByRole("button", { name: /unlock demo/i }).click();
}

test("companies CRM supports filtering and opens an AI-native company detail", async ({
  page
}) => {
  await unlockDemo(page);
  await page.getByRole("link", { name: /companies/i }).click();

  await expect(page).toHaveURL(/\/companies/);
  await expect(page.getByRole("heading", { name: "Companies" })).toBeVisible();
  await expect(page.getByText("12 companies tracked")).toBeVisible();

  await page.getByLabel("Sector").selectOption("Fintech");
  await page.getByLabel("Status").selectOption("Interested");
  await page.getByRole("button", { name: /apply filters/i }).click();

  await expect(page.getByRole("link", { name: /AtlasPay/i })).toBeVisible();
  await expect(page.getByText("Civitas Cloud")).not.toBeVisible();
  await expect(page.getByText("AI recommendation")).toBeVisible();
  await expect(
    page.getByText(
      "Schedule regulatory onboarding call and send digital zone benefits brief."
    )
  ).toBeVisible();

  await page.getByRole("link", { name: /AtlasPay/i }).click();

  await expect(page).toHaveURL(/\/companies\/atlaspay/);
  await expect(page.getByRole("heading", { name: "AtlasPay" })).toBeVisible();
  await expect(page.getByText("Sector: Fintech")).toBeVisible();
  await expect(page.getByText("Country: Argentina")).toBeVisible();
  await expect(page.getByText("Status: Interested")).toBeVisible();
  await expect(page.getByText("Priority: High")).toBeVisible();
  await expect(page.getByText("Last interaction: May 8, 2026")).toBeVisible();
  await expect(
    page.getByText("Next step: Regulatory onboarding call")
  ).toBeVisible();
  await expect(page.getByText("Digital Zone Readiness")).toBeVisible();
  await expect(page.getByText("AI summary")).toBeVisible();
  await expect(page.getByText("Documents associated")).toBeVisible();
  await expect(
    page.getByText("Knowledge Economy onboarding requirements")
  ).toBeVisible();
});

test("partners CRM demonstrates fintech partner relevance", async ({ page }) => {
  await unlockDemo(page);
  await page.getByRole("link", { name: /partners/i }).click();

  await expect(page).toHaveURL(/\/partners/);
  await expect(page.getByRole("heading", { name: "Partners" })).toBeVisible();
  await expect(page.getByText("4 institutional partners")).toBeVisible();

  await page.getByLabel("Sector").selectOption("Fintech");
  await page.getByRole("button", { name: /apply filters/i }).click();

  await expect(page.getByRole("link", { name: /Crecimiento/i })).toBeVisible();
  await expect(page.getByText("Aragon")).not.toBeVisible();
  await expect(page.getByText("Fintech relevance: 94%")).toBeVisible();
  await expect(
    page.getByText("Relevant for fintech companies").first()
  ).toBeVisible();

  await page.getByRole("link", { name: /Crecimiento/i }).click();

  await expect(page).toHaveURL(/\/partners\/crecimiento/);
  await expect(page.getByRole("heading", { name: "Crecimiento" })).toBeVisible();
  await expect(page.getByText("Partner type: Ecosystem")).toBeVisible();
  await expect(page.getByText("Linked sectors: Fintech, Web3")).toBeVisible();
  await expect(page.getByText("Recommended use cases")).toBeVisible();
  await expect(
    page.getByText("Introduce fintech leads to local ecosystem operators.")
  ).toBeVisible();
});
