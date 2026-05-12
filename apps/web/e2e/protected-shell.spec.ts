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

test("shell persists locale selection and stays light-only", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel(/demo access code/i).fill("anden-demo");
  await page.getByRole("button", { name: /unlock demo/i }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await page.getByRole("button", { name: /switch to spanish/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText(/panel ejecutivo/i)).toBeVisible();
  await expect(page.getByRole("navigation", { name: /primary/i })).toContainText(
    "Asistente"
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(
    page.getByRole("button", { name: /switch to dark mode/i })
  ).toHaveCount(0);

  await page.reload();
  await expect(page.getByText(/panel ejecutivo/i)).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");

  await page.getByRole("button", { name: /bloquear demo/i }).click();
  await expect(page).toHaveURL(/\/login/);
});

test("spanish locale updates core implemented routes", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel(/demo access code/i).fill("anden-demo");
  await page.getByRole("button", { name: /unlock demo/i }).click();
  await page.getByRole("button", { name: /switch to spanish/i }).click();

  await page.goto("/companies");
  await expect(page.getByRole("heading", { name: "Empresas" })).toBeVisible();
  await expect(page.getByText("12 empresas monitoreadas")).toBeVisible();
  await expect(page.getByRole("button", { name: /aplicar filtros/i })).toBeVisible();
  await expect(page.getByText("Recomendacion AI").first()).toBeVisible();

  await page.goto("/partners");
  await expect(page.getByRole("heading", { name: "Partners" })).toBeVisible();
  await expect(page.getByText("4 partners institucionales")).toBeVisible();
  await expect(page.getByText("Relevancia fintech").first()).toBeVisible();

  await page.goto("/documents");
  await expect(page.getByRole("heading", { name: "Documentos" })).toBeVisible();
  await expect(page.getByText("37 documentos indexados")).toBeVisible();
  await expect(page.getByRole("button", { name: /subir documento/i })).toBeVisible();
  await expect(page.getByText("Carga simulada")).toBeVisible();

  await page.goto("/workflows");
  await expect(page.getByRole("heading", { name: "Workflows" })).toBeVisible();
  await expect(page.getByText("Automatizacion")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /ejecutar onboarding de empresa/i })
  ).toBeVisible();
});
