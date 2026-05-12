import { expect, test, type Page } from "@playwright/test";

async function unlockDemo(page: Page) {
  await page.goto("/login");
  await page.getByLabel(/demo access code/i).fill("anden-demo");
  await page.getByRole("button", { name: /unlock demo/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test("reports history lists weekly briefs and opens a cited detail", async ({
  page
}) => {
  await unlockDemo(page);
  await page.goto("/reports");

  await expect(page.getByRole("heading", { name: "Reports" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Weekly Operating Brief - May 11, 2026/i })
  ).toBeVisible();
  await expect(page.getByText("Period: May 4, 2026 - May 11, 2026")).toBeVisible();
  await expect(page.getByText("Locale: EN")).toBeVisible();
  await expect(page.getByText("mock/mock-seed")).toBeVisible();
  await expect(page.getByText("Estimated cost: $0.00")).toBeVisible();
  await expect(page.getByText("Legal review required").first()).toBeVisible();

  await page
    .getByRole("link", { name: /Weekly Operating Brief - May 11, 2026/i })
    .click();

  await expect(page).toHaveURL(/\/reports\/weekly-operating-brief-2026-05-11/);
  await expect(
    page.getByRole("heading", { name: "Weekly Operating Brief - May 11, 2026" })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Progress" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Key risks" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Recommended next actions" })
  ).toBeVisible();
  await expect(
    page.getByText(/Dashboard, CRM, and document library/i).first()
  ).toBeVisible();
  await expect(page.getByText("Source citations")).toBeVisible();
  await expect(page.getByText("Weekly Operating Brief Template")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /copy report text/i })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /download report text/i })
  ).toBeVisible();
});

test("reports route responds to locale and remains light-only", async ({ page }) => {
  await unlockDemo(page);
  await page.goto("/reports");

  await page.getByRole("button", { name: /switch to spanish/i }).click();
  await expect(page.getByRole("heading", { name: "Reportes" })).toBeVisible();
  await expect(page.getByText("Periodo: May 4, 2026 - May 11, 2026")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(
    page.getByRole("button", { name: /switch to dark mode/i })
  ).toHaveCount(0);
  await expect(page.getByText("mock/mock-seed")).toBeVisible();
});
