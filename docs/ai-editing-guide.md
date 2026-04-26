# AI Editing Guide

Use this guide when making common changes. Keep edits focused and validate with lint and build.

## Add New Demo Prompt

Edit:

- `lib/grocery/demoPrompts.ts`

Add a new object with `id`, `text`, and `explanation`. The `/demo` page reads this array automatically.

## Change Parser Rules

Edit:

- `lib/grocery/parseGroceryRequest.ts`
- `lib/grocery/types.ts` only if the shared data contract must change

Keep parser behavior deterministic until a real AI parser is explicitly requested.

## Replace Mock Cart Provider With Real Provider

Edit carefully:

- `lib/cart/CartProvider.ts`
- `lib/cart/RohlikCartProvider.ts`
- a future server-side API route if credentials, session, or MCP access is needed

SECURITY: Never put Rohlik credentials in frontend code.

TODO(integration): Real order confirmation must remain on the merchant side.

## Add New Page

Edit:

- `app/<route>/page.tsx`

Add reusable UI in:

- `components/`

Keep route files compositional. Put complex browser behavior in a client component.

## Change UI Copy

Edit:

- `components/Hero.tsx` for home hero copy
- `components/VoiceInput.tsx` for voice/manual input copy
- `components/CartPreview.tsx` for cart CTA and preview copy
- `app/docs/page.tsx` for documentation page copy
- `lib/grocery/demoPrompts.ts` for demo prompt copy

## Add Environment Variable

Edit:

- `README.md`
- `docs/architecture.md`
- the server-side module that reads the variable

Do not expose secrets through `NEXT_PUBLIC_` unless the value is intentionally public.

SECURITY: Secret values must be configured in Vercel environment variables or local `.env*` files that are not committed.

## Add New Reusable Component

Edit:

- `components/NewComponent.tsx`

Use typed props. Keep business logic in `lib/` unless the behavior is purely presentational.

## Update Documentation

Edit:

- `README.md` for project-level instructions
- `docs/architecture.md` for architecture changes
- `docs/decision-log.md` for decisions
- `docs/file-map.md` for navigation and ownership changes
- `AGENTS.md` for AI-agent workflow changes
