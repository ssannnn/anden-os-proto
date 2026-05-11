# Andén OS Context

## Purpose

Andén OS is a demo of an internal AI backoffice for Andén. It shows how Andén could operate institutional knowledge, company and partner relationships, documents, workflows, and executive decisions with AI agents.

The demo is not a public marketing site and not a government portal. It is an internal operating layer for a founder or Head of Operations at Andén.

## Core Domain

- **Andén**: Infrastructure company building digital rails for special regimes and Digital Zones.
- **Andén OS**: Internal operating system concept for coordinating knowledge, documents, companies, partners, workflows, and executive reports.
- **AI Backoffice Demo**: The first product demo of Andén OS, using mock business data and real curated Argentina regulatory sources.
- **Argentina Digital Zone Operations**: The initial operating context. The system should feel prepared for more jurisdictions, but the MVP regulatory knowledge base is Argentina-only.
- **Digital Zone**: Operational framing for using existing legal and institutional regimes to help companies access digital-zone-like benefits and processes.
- **Company / Lead**: An institution or company in Andén's pipeline. Companies have sector, country, status, priority, last interaction, next step, linked documents, AI summary, and AI recommended action.
- **Partner**: Institutional, software, regulatory, ecosystem, or operational partner that can help Andén or companies in the pipeline.
- **Source Pack**: Versioned document corpus used by the demo. It includes real curated Argentina regulatory material and mock internal Andén documents.
- **AI Knowledge Assistant**: Internal chat that answers questions using RAG, cites sources, and marks operational inference separately from sourced regulatory statements.
- **Workflow Automation**: Simulated but credible workflows for company onboarding, meeting preparation, and institutional content publishing.
- **Weekly Operating Brief**: Executive report generated from companies, partners, workflows, assistant activity, document events, and relevant source-pack material.
- **Legal Review Required**: Product state used when AI output includes regulatory interpretation or content that may affect external communications or onboarding decisions.
- **Knowledge Gap**: Logged state when the assistant cannot find enough internal or regulatory sources to answer confidently.

## MVP Positioning

The demo should make a founder think: "This should exist inside the company."

The value demonstrated is:

- less manual operational coordination
- centralized knowledge
- faster onboarding
- automatic reporting
- better decision support
- better coordination with software factory and legal/compliance teams
- internal AI systems capability

## Users

Primary user:

- Founder / Head of Operations at Andén.

Secondary users:

- Partnerships
- Legal/compliance
- Software factory coordination
- Institutional operations

## Product Scope

The MVP includes:

- password-protected deployable web app
- executive dashboard
- AI Knowledge Assistant
- companies CRM
- partners CRM
- document library and document intelligence
- three simulated workflows
- weekly operating brief generator
- reports history
- EN/ES language selector
- light/dark mode
- Supabase persistence for chats, reports, document index state, workflow runs, and AI usage
- OpenAI-backed AI features with a USD 5 cost guard and mock fallback

Out of scope for the MVP:

- government-facing portal
- real company data
- full legal advice
- full CRM editing workflow
- full document management system
- user/team/role permissions
- multi-jurisdiction regulatory corpus
- production-grade workflow builder
- billing or public signup

## Regulatory Knowledge Rules

Use real curated Argentina regulatory sources for the MVP:

- Ley 27.506 and Ley 27.570 for the Régimen de Promoción de la Economía del Conocimiento
- Decreto 1034/2020
- official Argentina.gob.ar registration guidance for the Knowledge Economy regime
- Ley 24.331 on Zonas Francas
- ARCA/AFIP material relevant to Zonas Francas

Regulatory source text remains in Spanish. The app may provide operational summaries in English or Spanish depending on the active locale. Do not imply that English summaries are official translations.

AI output involving regulatory interpretation must show the contextual warning:

> AI-generated operational draft. Regulatory interpretations require Legal review before external use or company onboarding decisions.

Spanish:

> Borrador operativo generado por AI. Las interpretaciones regulatorias requieren revisión de Legal antes de uso externo o decisiones de onboarding.

## Assistant Behavior

The assistant must:

- cite internal or regulatory sources for substantive answers
- separate sourced answer from operational inference
- preserve original Spanish source titles/excerpts when citing regulations
- answer in the active locale
- avoid inventing sources
- mark low-confidence drafts clearly
- log knowledge gaps when sources are insufficient

Golden prompts:

1. What is Andén's value proposition?
2. Summarize the requirements for a company to join an Argentina digital zone.
3. Which partners are most relevant for fintech companies?
4. Generate a briefing for a meeting with a government stakeholder about expanding digital zone operations.
5. What documents should we request from a new fintech company?

Spanish equivalents should work as well.

## Visual Language

Use Andén's existing brand system as the base:

- cream canvas: `#F2ECE0`
- cream light surface: `#F7F3E7`
- brown dark ink: `#390400`
- body ink: `#2B2B2B`
- lime accent: `#E0E738`
- orange accent: `#F9982F`
- blue accent: `#303994`
- sky accent: `#A9D6F3`
- periwinkle accent: `#8894FF`

The backoffice should be operational-dense with brand-rich moments. Use Jost for operational UI. Use Fraunces or Alfarn only for brand moments if licensing permits.

Avoid making the app feel like a landing page. The first screen after login is the dashboard.
