# PRD: Andén OS - AI Backoffice Demo

## Problem Statement

Andén needs a credible way to show that its internal operations could be accelerated by an AI-native operating layer. The demo must prove that Andén can centralize knowledge, coordinate companies and partners, reason over regulatory documents, run repeatable workflows, and generate executive operating reports.

The demo should not feel like a static mockup. It should feel like the first version of a real internal system that could give the company leverage immediately.

## Solution

Build a password-protected web demo called Andén OS. The demo is an internal AI backoffice for Andén's Founder / Head of Operations.

It combines:

- an executive dashboard
- an AI Knowledge Assistant with citations
- company and partner CRM views
- document intelligence over a curated source pack
- simulated workflow automation
- weekly executive operating brief generation

Business data is mocked. Argentina regulatory sources are real and curated from official sources. AI features use a low-cost hosted OpenAI provider for the deployed demo, with a USD 5 guard and mock fallback.

## User Stories

1. As a founder, I want to see operational KPIs immediately after login, so that I can understand the state of Andén's pipeline and operations.
2. As a founder, I want to generate a weekly operating brief, so that I can turn operational data and knowledge into an executive summary.
3. As a founder, I want the weekly brief to show progress, risks, blockers, opportunities, and next actions, so that I can make decisions quickly.
4. As a founder, I want weekly briefs to be saved, so that I can review past operating snapshots.
5. As an operations lead, I want to see companies and leads in a CRM-style view, so that I can track status, priority, and next steps.
6. As an operations lead, I want each company to include an AI summary and recommended action, so that I can decide what to do next.
7. As an operations lead, I want company records linked to documents, so that onboarding and regulatory context are easy to inspect.
8. As a partnerships lead, I want to browse institutional partners, so that I can identify relevant partners for company segments.
9. As a partnerships lead, I want partner relevance for fintech companies, so that I can plan introductions or support.
10. As a legal/compliance user, I want regulatory answers to cite official sources, so that I can verify AI output.
11. As a legal/compliance user, I want regulatory interpretations marked for legal review, so that AI drafts do not become external guidance without approval.
12. As an internal user, I want to ask "What is Andén's value proposition?", so that I can reuse consistent positioning.
13. As an internal user, I want to ask about requirements for joining an Argentina digital zone, so that I can understand onboarding needs.
14. As an internal user, I want to ask what documents to request from a new fintech company, so that onboarding is faster.
15. As an internal user, I want the assistant to answer in English or Spanish depending on the selected language, so that the demo works for both audiences.
16. As an internal user, I want citations to preserve original Spanish regulatory sources, so that official source language is clear.
17. As an internal user, I want the assistant to say when sources are insufficient, so that knowledge gaps are visible.
18. As an operations lead, I want knowledge gaps to be logged, so that missing documents can become follow-up work.
19. As an operations lead, I want to see a document library with source type, jurisdiction, index status, and update metadata, so that the knowledge base feels operational.
20. As a legal/compliance user, I want document detail pages with summary, entities, risks, checklist, and linked companies or partners, so that review work is faster.
21. As an internal user, I want semantic document search, so that I can find relevant internal or regulatory material.
22. As an operations lead, I want to run a company onboarding workflow, so that the system produces a plan, required documents, fit assessment, and next step.
23. As an operations lead, I want to run a meeting preparation workflow, so that I get briefing notes, talking points, risks, suggested questions, and follow-up email.
24. As a content or institutional lead, I want to run a content publishing workflow, so that I get an outline, draft, SEO metadata, LinkedIn post, and newsletter snippet.
25. As a demo presenter, I want workflows to show visible step progress, so that the audience sees automation happening.
26. As a demo presenter, I want golden-path AI answers to be reliable, so that the live demo does not depend on fragile prompting.
27. As a demo presenter, I want a public URL protected by a password, so that Andén stakeholders can open the demo without account setup.
28. As a demo owner, I want hosted AI usage capped at USD 5, so that the demo cannot run up unexpected costs.
29. As a demo owner, I want the app to fall back to mock AI when the cost limit is reached, so that the demo remains usable.
30. As a stakeholder, I want the UI to use Andén's visual identity, so that the product feels native to the company.
31. As a user, I want light and dark mode, so that the demo feels polished and adaptable.
32. As a user, I want the app to be usable on desktop and mobile, so that it can be shared and reviewed flexibly.

## Implementation Decisions

- The app is an internal backoffice, not a public marketing page and not a government portal.
- The primary user is Founder / Head of Operations.
- The MVP operating context is Argentina Digital Zone Operations.
- The business data is mocked; the regulatory source pack uses real curated Argentina sources.
- The first screen after login is the dashboard.
- The main demo moment is `Generate Weekly Operating Brief`.
- The AI Knowledge Assistant requires citations for substantive answers.
- Regulatory answers separate sourced statements from operational inference.
- AI regulatory interpretation shows `Legal review required` where applicable.
- The app supports EN/ES globally without separate localized routes.
- Reports and chats are stored with the locale used at generation time.
- Supabase is used from day one for persistence, with fallback mock data for local development.
- The AI layer uses a provider adapter with `mock`, `openai`, and `ollama` modes.
- Hosted AI cost is controlled by a USD 5 guard and usage events.
- RAG is implemented with app-owned document chunks and vector search, not managed file search.
- The source pack is versioned in the repo with source metadata.
- Regulatory source text remains in Spanish, with curated English and Spanish operational summaries.
- The visual system uses Andén's real brand tokens, Jost for operational UI, and Fraunces/Alfarn only for selected brand moments if licensing permits.
- Authentication is a password gate backed by a server-side cookie, not a full user system.

Major modules:

- App shell and password gate
- Design tokens and UI primitives
- Mock data and seed data
- Supabase schema and data access
- AI provider adapter
- AI cost guard and usage logging
- Source pack ingestion and chunking
- Retrieval and citation service
- Assistant experience
- Companies and partners CRM
- Documents and document intelligence
- Workflow run engine for simulated workflows
- Weekly operating brief generator
- Reports history
- i18n and theme state

## Testing Decisions

Good tests should verify externally visible behavior, not implementation details.

Test the following modules:

- password gate route protection
- locale selection and localized rendering
- AI provider adapter fallback behavior
- AI cost guard threshold and hard-stop behavior
- retrieval service returns citations and handles empty results
- assistant API refuses unsupported/no-source answers or marks low confidence
- weekly operating brief generation persists reports with citations and estimated cost
- workflow runs persist step status and output
- document parsing/chunking preserves source metadata

UI smoke tests should cover the golden demo path:

- login
- dashboard visible
- assistant golden prompt answered with sources
- company detail visible
- workflow run completes
- weekly brief generated and visible in reports

## Out of Scope

- full production auth and authorization
- real customer/company data
- full document management with permissions and versioning
- OCR and arbitrary PDF ingestion hardening
- full workflow builder
- government-facing dashboard
- multi-jurisdiction regulatory corpus
- production legal advice
- billing, teams, or public signup
- replacing the human legal review process

## Further Notes

The demo script target is seven minutes:

1. Login and frame the internal AI operating system.
2. Show dashboard and operating pulse.
3. Ask the AI Knowledge Assistant a regulatory question with citations.
4. Open company/partner CRM and show AI recommended action.
5. Run the meeting preparation workflow.
6. Generate the weekly operating brief.

Definition of done:

- public deploy protected by password
- dashboard, assistant, CRM, documents, workflows, and reports are navigable
- 5 golden prompts work in EN/ES
- regulatory responses cite official curated sources
- weekly operating brief generates and persists
- cost guard blocks hosted AI after USD 5 and falls back to mock
- light/dark and EN/ES work
- no visible errors in desktop or mobile demo paths
