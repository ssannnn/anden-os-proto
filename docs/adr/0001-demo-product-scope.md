# ADR 0001: Demo Product Scope

## Status

Accepted

## Date

2026-05-11

## Context

The goal is to build "Andén OS - AI Backoffice Demo" for `www.anden.tech`. The demo must show that Andén could have an internal AI layer for operating knowledge, partners, companies, documents, processes, and decisions.

The product must feel real even when business data is mocked. Regulatory knowledge is the exception: the Argentina regulatory source pack must use real, official sources.

## Decision

Build the MVP as an internal backoffice for Andén, optimized for a Founder / Head of Operations user.

The first operating context is Argentina Digital Zone Operations. The product is architected as multi-jurisdiction capable, but the MVP regulatory knowledge base is Argentina-only.

The demo's main wow moment is `Generate Weekly Operating Brief`. The AI Knowledge Assistant is the second major moment and must cite sources.

The MVP includes:

- executive dashboard
- AI Knowledge Assistant
- companies and partners CRM
- document library and document intelligence
- three workflows: company onboarding, prepare meeting, publish institutional content
- executive reports with weekly operating brief generation
- password gate
- EN/ES language selector
- light/dark mode
- deployable public URL protected by password

The guided demo target duration is seven minutes.

## Consequences

The app should prioritize operational density and executive clarity over marketing composition.

Government portal features, full CRM editing, real company records, production workflow authoring, and complex auth are out of scope for the MVP.

The MVP is complete when the password-protected deploy works, the 5 golden prompts work in EN/ES with citations, the dashboard/CRM/documents/workflows/reports flows are navigable, the weekly operating brief generates and persists, and the USD 5 cost guard is active.
