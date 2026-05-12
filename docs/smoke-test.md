# Demo Smoke Test Checklist

Run this checklist before sharing a demo URL.

Test URL:

```text
https://...
```

Tester:

```text
Name / date
```

## Automated Checks

```bash
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm validate:db:artifacts
pnpm build
E2E_PORT=3307 pnpm test:e2e
```

Expected result: all commands pass.

## Access And Shell

- [ ] `/login` loads.
- [ ] Wrong access code shows an error.
- [ ] Correct `DEMO_ACCESS_CODE` opens `/dashboard`.
- [ ] `Lock demo` returns to `/login`.
- [ ] Navigation includes Dashboard, Assistant, Companies, Partners, Documents,
  Workflows, and Reports.
- [ ] Theme is light-only.
- [ ] No dark-mode toggle is visible.

## EN/ES

- [ ] Default language is English.
- [ ] Locale toggle switches to Spanish without changing route.
- [ ] Refresh keeps the selected language.
- [ ] Dashboard labels switch to Spanish.
- [ ] Companies, partners, documents, workflows, and reports show translated
  core labels.
- [ ] AI-generated chats and reports display the locale used at generation time.

## Dashboard

- [ ] KPI cards are visible.
- [ ] AI spend cap shows `$0.00 / $5.00` or current spend.
- [ ] Alerts are readable.
- [ ] Priority pipeline has no text overlap.
- [ ] `Generate Weekly Operating Brief` is visible.

## Assistant Golden Prompts

Run the five golden prompts:

- [ ] `What is Anden's value proposition?`
- [ ] `Summarize the requirements for a company to join an Argentina digital zone.`
- [ ] `Which partners are most relevant for fintech companies?`
- [ ] `Generate a briefing for a meeting with a government stakeholder about expanding digital zone operations.`
- [ ] `What documents should we request from a new fintech company?`

For each prompt:

- [ ] Answer renders without an error.
- [ ] At least one source citation is visible.
- [ ] Regulatory answers show legal review language when applicable.
- [ ] Original-language labels are visible for Spanish sources.

Knowledge-gap check:

- [ ] Ask `Does Anden guarantee payroll tax refunds in Brazil?`
- [ ] Assistant returns a knowledge-gap response instead of inventing an answer.

## CRM

- [ ] `/companies` loads.
- [ ] Filter Sector = `Fintech` and Status = `Interested`.
- [ ] `AtlasPay` remains visible and unrelated companies are filtered out.
- [ ] `AtlasPay` detail opens.
- [ ] AI summary, AI recommendation, next step, and linked documents are visible.
- [ ] `/partners` loads.
- [ ] Filter Sector = `Fintech`.
- [ ] Partner relevance and recommended use cases are visible.

## Documents

- [ ] `/documents` loads.
- [ ] Filter Type = `Regulation`, Jurisdiction = `Argentina`.
- [ ] Official Argentina source documents are visible.
- [ ] A legal-reviewed document detail opens.
- [ ] Summary, source URL, entities, risks, checklist, linked companies, and
  linked partners are visible.

## Workflows

- [ ] `/workflows` loads.
- [ ] Run `Company onboarding`.
- [ ] Step progression is visible.
- [ ] Generated outputs appear.
- [ ] Citations appear.
- [ ] Legal review flag appears when applicable.
- [ ] Run history updates.
- [ ] Optional: run `Prepare meeting` and verify talking points, risks,
  questions, and follow-up email.

## Reports

- [ ] Generate a weekly operating brief from `/dashboard`.
- [ ] Report renders progress, risks, opportunities, blockers, recommended next
  actions, legal review items, and citations.
- [ ] Provider/model and estimated cost are visible.
- [ ] `/reports` lists generated briefs.
- [ ] Report detail opens.
- [ ] Copy text and download text controls are visible.

## Layout

Desktop:

- [ ] Dashboard has no obvious overlap.
- [ ] Assistant answer cards are readable.
- [ ] Reports list/detail has readable CTA contrast.

Mobile:

- [ ] Login fits on screen.
- [ ] Dashboard navigation wraps coherently.
- [ ] Documents list cards do not overflow.
- [ ] Workflow forms remain usable.

## Reset

Mock deploy:

- [ ] Click `Lock demo`.
- [ ] Clear site data if locale should reset.
- [ ] Log in again and confirm `/dashboard` is clean.

Supabase local:

- [ ] Run `pnpm db:reset`.
- [ ] Run `pnpm validate:db`.

Hosted Supabase:

- [ ] Follow the hosted reset procedure in [deploy.md](deploy.md).
