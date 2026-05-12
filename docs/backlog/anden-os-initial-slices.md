# Initial Backlog: Andén OS AI Backoffice Demo

These are vertical tracer-bullet slices. Each issue should deliver something demoable or verifiable.

## Published Issues

Parent PRD: https://github.com/ssannnn/anden-os-proto/issues/1

| Slice | GitHub issue |
| --- | --- |
| 1 | https://github.com/ssannnn/anden-os-proto/issues/2 |
| 2 | https://github.com/ssannnn/anden-os-proto/issues/3 |
| 3 | https://github.com/ssannnn/anden-os-proto/issues/4 |
| 4 | https://github.com/ssannnn/anden-os-proto/issues/5 |
| 5 | https://github.com/ssannnn/anden-os-proto/issues/6 |
| 6 | https://github.com/ssannnn/anden-os-proto/issues/7 |
| 7 | https://github.com/ssannnn/anden-os-proto/issues/8 |
| 8 | https://github.com/ssannnn/anden-os-proto/issues/9 |
| 9 | https://github.com/ssannnn/anden-os-proto/issues/10 |
| 10 | https://github.com/ssannnn/anden-os-proto/issues/11 |
| 11 | https://github.com/ssannnn/anden-os-proto/issues/12 |
| 12 | https://github.com/ssannnn/anden-os-proto/issues/13 |
| 13 | https://github.com/ssannnn/anden-os-proto/issues/14 |

## 1. Scaffold monorepo, app shell, design tokens, and password gate

Type: AFK

Blocked by: None

Build the pnpm workspace, Next.js web app, shared packages, Andén brand tokens, light-theme foundation, app shell, and password gate.

## 2. Build dashboard shell with mocked operational data

Type: AFK

Blocked by: 1

Build the dashboard first viewport with KPI strip, AI operating pulse, alerts, priority pipeline, recent AI queries, workflow activity, and `Generate Weekly Operating Brief` entry point using mock data.

## 3. Build companies and partners CRM MVP

Type: AFK

Blocked by: 1

Build list/detail CRM views for companies and partners with filters, priority/status badges, AI summary, recommended action, linked documents, and partner relevance.

## 4. Build document source pack and document library

Type: AFK

Blocked by: 1

Create the versioned source pack structure, seed real curated Argentina regulatory metadata and mock internal documents, and render a document library/detail UI.

## 5. Add Supabase schema, seed data, and fallback mock data

Type: AFK

Blocked by: 1

Add migrations and seed data for companies, partners, documents, document chunks, workflows, workflow runs, assistant threads/messages, reports, AI usage events, and demo settings.

## 6. Implement AI provider adapter and USD 5 cost guard

Type: AFK

Blocked by: 1 and 5

Implement `mock`, `openai`, and optional `ollama` provider modes, usage logging, estimated cost accounting, 80% warning, hard stop at USD 5, and mock fallback.

## 7. Implement RAG indexing and source-aware retrieval

Type: AFK

Blocked by: 4, 5, and 6

Chunk/index the source pack, store embeddings and metadata, retrieve relevant chunks, and return citations with original-language source metadata.

## 8. Build AI Knowledge Assistant golden path

Type: AFK

Blocked by: 6 and 7

Build the assistant chat UI/API, source citations, operational inference section, legal review warning, knowledge gap behavior, and 5 golden prompts in EN/ES.

## 9. Build workflow automation simulations

Type: AFK

Blocked by: 3, 6, and 7

Build company onboarding, prepare meeting, and publish institutional content workflows with input forms, visible step progress, generated outputs, citations/confidence, and saved run history.

## 10. Build weekly operating brief generator

Type: AFK

Blocked by: 2, 3, 6, 7, and 9

Generate a structured weekly operating brief from companies, partners, workflows, assistant/document events, and source-pack retrieval. Persist report content, citations, locale, model, and estimated cost.

## 11. Build reports history

Type: AFK

Blocked by: 10

Build `/reports` with generated brief history, report detail, citations, legal review items, locale metadata, and export/share affordances suitable for the demo.

## 12. Finish EN/ES and light-theme polish

Type: AFK

Blocked by: 2, 3, 8, 9, 10, and 11

Apply global EN/ES dictionaries, persist language selection, ensure AI outputs use active locale, remove dark-mode affordances, and verify charts/badges/tables in the light theme.

## 13. Demo hardening, script, and deploy

Type: AFK

Blocked by: 1 through 12

Prepare the password-protected public deploy, environment documentation, 7-minute demo script, smoke-test checklist, mobile/desktop verification, and final demo data reset path.
