# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout

This repo is a multi-context monorepo.

Expected structure:

```text
/
├── CONTEXT-MAP.md
├── docs/adr/
└── src/
    ├── <context>/
    │   ├── CONTEXT.md
    │   └── docs/adr/
    └── <context>/
        ├── CONTEXT.md
        └── docs/adr/
```

## Before exploring, read these

- **`CONTEXT-MAP.md`** at the repo root. It points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`docs/adr/`** for system-wide architectural decisions.
- **`src/<context>/docs/adr/`** for context-specific decisions in the area you are about to work in.

If any of these files don't exist, proceed silently. Don't flag their absence and don't suggest creating them upfront. The producer skill (`/grill-with-docs`) creates them lazily when terms or decisions actually get resolved.

## Use the glossary's vocabulary

When your output names a domain concept in an issue title, a refactor proposal, a hypothesis, or a test name, use the term as defined in the relevant `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use, or there's a real gap to note for `/grill-with-docs`.

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders), but worth reopening because..._
