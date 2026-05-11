import { expect, test } from "@playwright/test";

test("password gate protects Anden OS and opens the operating shell", async ({
  page
}) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login/);
  await expect(
    page.getByRole("heading", { name: /and[eé]n os/i })
  ).toBeVisible();

  await page.getByLabel(/demo access code/i).fill("wrong-code");
  await page.getByRole("button", { name: /unlock demo/i }).click();
  await expect(page.getByText(/invalid access code/i)).toBeVisible();

  await page.getByLabel(/demo access code/i).fill("anden-demo");
  await page.getByRole("button", { name: /unlock demo/i }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(
    page.getByRole("heading", { name: /executive dashboard/i })
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: /primary/i })).toContainText(
    "Assistant"
  );

  await page.getByRole("link", { name: /documents/i }).click();
  await expect(page).toHaveURL(/\/documents/);
  await expect(
    page.getByRole("heading", { name: /documents/i })
  ).toBeVisible();
});

test("shell exposes locale and theme controls", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel(/demo access code/i).fill("anden-demo");
  await page.getByRole("button", { name: /unlock demo/i }).click();

  await page.getByRole("button", { name: /switch to spanish/i }).click();
  await expect(page.getByText(/panel ejecutivo/i)).toBeVisible();

  await page.getByRole("button", { name: /switch to dark mode/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: /lock demo/i }).click();
  await expect(page).toHaveURL(/\/login/);
});
