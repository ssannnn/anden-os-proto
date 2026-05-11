# ADR 0003: Brand System And UI Direction

## Status

Accepted

## Date

2026-05-11

## Context

The app should look like it belongs to Andén, not like a generic SaaS template or a clone of another productivity product. The public Andén website already exposes a distinctive brand system.

Observed brand tokens from `www.anden.tech`:

- cream: `#F2ECE0`
- cream light: `#F7F3E7`
- brown dark: `#390400`
- body ink: `#2B2B2B`
- lime: `#E0E738`
- orange: `#F9982F`
- orange pressed: `#D97818`
- blue: `#303994`
- sky: `#A9D6F3`
- periwinkle: `#8894FF`
- muted brown: `#7A6250`

The website also uses route/circuit-like background lines, large rounded sections, lime CTAs, and a mix of Fraunces, Alfarn, and Jost typography.

## Decision

Build Andén OS with primitives based on the real Andén brand system.

Use:

- Jost for dense operational UI
- Fraunces for selected headings and brand moments
- Alfarn only if licensing permits and only for brand moments
- cream and cream-light as light-mode surfaces
- brown-dark as the primary ink
- lime for primary action and success emphasis
- orange for warnings, risks, and review states
- blue/periwinkle for AI and institutional surfaces
- subtle route/circuit patterns recreated in the app, not copied wholesale from the site

Support light and dark mode from the start.

The visual direction is operational-dense with brand-rich moments:

- dashboard, CRM, documents, workflows, and reports are dense and readable
- login, report covers, and empty states can carry more brand expression
- cards, tables, and controls should be compact and scan-friendly

## Consequences

The product will feel connected to Andén while remaining a usable internal backoffice.

The app should avoid landing-page composition, decorative overuse, and marketing-sized type inside operational surfaces.
