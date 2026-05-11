import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function unlockDemo(page: Page) {
  await page.goto("/login");
  await page.getByLabel(/demo access code/i).fill("anden-demo");
  await page.getByRole("button", { name: /unlock demo/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test("document library filters official Argentina regulations and opens a legal-reviewed detail", async ({
  page
}) => {
  await unlockDemo(page);
  await page.getByRole("link", { name: /documents/i }).click();

  await expect(page).toHaveURL(/\/documents/);
  await expect(page.getByRole("heading", { name: "Documents" })).toBeVisible();
  await expect(page.getByText("37 documents indexed")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /upload document/i })
  ).toBeVisible();
  await expect(page.getByText("Simulated upload")).toBeVisible();

  await page.getByLabel("Type").selectOption("Regulation");
  await page.getByLabel("Jurisdiction").selectOption("Argentina");
  await page.getByRole("button", { name: /apply filters/i }).click();

  await expect(
    page.getByRole("link", {
      name: /Ley 27\.506 - Régimen de Economía del Conocimiento/i
    })
  ).toBeVisible();
  await expect(page.getByText("Official source").first()).toBeVisible();
  await expect(page.getByText("Indexed").first()).toBeVisible();

  await page
    .getByRole("link", {
      name: /Ley 27\.506 - Régimen de Economía del Conocimiento/i
    })
    .click();

  await expect(page).toHaveURL(/\/documents\/argentina-knowledge-economy-law/);
  await expect(
    page.getByRole("heading", {
      name: "Ley 27.506 - Régimen de Economía del Conocimiento"
    })
  ).toBeVisible();
  await expect(
    page.getByText("Legal review required", { exact: true }).first()
  ).toBeVisible();
  await expect(page.getByText("Original source in Spanish").first()).toBeVisible();
  await expect(page.getByText("Source URL")).toBeVisible();
  await expect(
    page.getByText(
      "https://www.argentina.gob.ar/normativa/nacional/ley-27506-324101/actualizacion"
    )
  ).toBeVisible();
  await expect(page.getByText("Entities")).toBeVisible();
  await expect(page.getByText("Risks")).toBeVisible();
  await expect(page.getByText("Checklist")).toBeVisible();
  await expect(page.getByText("Linked companies")).toBeVisible();
  await expect(page.getByText("AtlasPay")).toBeVisible();
  await expect(
    page.getByText("Knowledge Economy eligibility", { exact: true }).first()
  ).toBeVisible();
});

test("document library exposes internal mock documents without legal-review blocking", async ({
  page
}) => {
  await unlockDemo(page);
  await page.goto("/documents");

  await page.getByLabel("Type").selectOption("Internal memo");
  await page.getByLabel("Jurisdiction").selectOption("Internal");
  await page.getByRole("button", { name: /apply filters/i }).click();

  await expect(
    page.getByRole("link", { name: /Andén Value Proposition/i })
  ).toBeVisible();
  await expect(page.getByText("Internal mock").first()).toBeVisible();
  await expect(
    page.getByText("Ley 27.506 - Régimen de Economía del Conocimiento")
  ).not.toBeVisible();

  await page.getByRole("link", { name: /Andén Value Proposition/i }).click();

  await expect(page).toHaveURL(/\/documents\/anden-value-proposition/);
  await expect(
    page.getByRole("heading", { name: "Andén Value Proposition" })
  ).toBeVisible();
  await expect(page.getByText("Legal review not required")).toBeVisible();
  await expect(
    page.getByText(
      "Internal source pack: supabase/seed/source-pack/internal/anden-value-proposition.md"
    )
  ).toBeVisible();
  await expect(page.getByText("Founder demo script")).toBeVisible();
  await expect(page.getByText("Crecimiento")).toBeVisible();
});
