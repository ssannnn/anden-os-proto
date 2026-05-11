import { expect, test } from "@playwright/test";

import type { Page } from "@playwright/test";

async function unlockDemo(page: Page) {
  await page.goto("/login");
  await page.getByLabel(/demo access code/i).fill("anden-demo");
  await page.getByRole("button", { name: /unlock demo/i }).click();
}

test("dashboard presents the Anden operating pulse with mock metrics", async ({
  page
}) => {
  await unlockDemo(page);

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(
    page.getByRole("heading", { name: /executive dashboard/i })
  ).toBeVisible();

  await expect(page.getByText("12 companies tracked")).toBeVisible();
  await expect(page.getByText("4 institutional partners")).toBeVisible();
  await expect(page.getByText("37 documents indexed")).toBeVisible();
  await expect(page.getByText("8 pending workflows")).toBeVisible();
  await expect(page.getByText("92% AI retrieval confidence")).toBeVisible();
  await expect(page.getByText("14 hours saved this week")).toBeVisible();
  await expect(page.getByText("Mock fallback")).toBeVisible();

  await expect(
    page.getByRole("heading", { name: /ai operating pulse/i })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /priority pipeline/i })
  ).toBeVisible();
  await expect(page.getByText("AtlasPay")).toBeVisible();
  await expect(
    page.getByText("Legal review required", { exact: true })
  ).toBeVisible();
  await expect(page.getByText("Recent AI queries")).toBeVisible();
  await expect(page.getByText("Active workflows")).toBeVisible();

  await expect(
    page.getByRole("button", { name: /generate weekly operating brief/i })
  ).toBeVisible();
});
