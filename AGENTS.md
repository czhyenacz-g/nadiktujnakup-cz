# AGENTS.md

Primary instructions for AI coding agents working on this repository.

## Project Goal

Build and maintain a clean MVP for a Czech voice grocery assistant. A user can dictate or type a grocery request, the app converts it into a structured list, and a mocked cart provider returns a demo cart preview.

The current MVP must not place real orders, store Rohlik credentials, or call real Rohlik/MCP/OpenAI/Claude APIs.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Vercel-ready deployment
- No database
- No authentication
- No payments

## Folder Map

- `app/` - route files, metadata, page composition
- `components/` - reusable UI and client interaction components
- `lib/grocery/` - typed grocery parsing and demo prompt data
- `lib/cart/` - cart provider interface, mock provider, future Rohlik provider placeholder
- `lib/speech/` - browser speech input hook
- `docs/` - architecture, AI editing notes, decisions, file map

## Where To Change What

- UI layout and pages: `app/`
- Reusable UI components: `components/`
- Grocery parsing: `lib/grocery/`
- Cart integration: `lib/cart/`
- Speech input: `lib/speech/`
- Documentation: `docs/`
- Future Rohlik/MCP integration: `lib/cart/RohlikCartProvider.ts` or a server-side API route

## Allowed Commands

Use these commands for normal local work:

```bash
npm run lint
npm run build
npm run dev
git status --short
git diff
```

Do not run destructive git commands unless the user explicitly asks for them.

## Coding Conventions

- Keep files small and focused.
- Prefer explicit exports.
- Avoid deeply nested abstractions.
- Avoid large multi-purpose utility files.
- Keep business logic out of React page components.
- Every important module should start with a short purpose comment.
- Every service should expose typed interfaces.
- Add comments only where they clarify future integration or non-obvious behavior.
- Do not introduce new dependencies without documenting why.

## UI Components

Add reusable visual components in `components/`.

Use Tailwind classes because the project already uses Tailwind. Keep components presentational when possible. Client components should be used only when browser state, events, or Web APIs are needed.

## Service Logic

Add grocery logic in `lib/grocery/`.

Add cart logic in `lib/cart/`.

Add speech/browser integration logic in `lib/speech/`.

Do not hide important behavior in generic helpers.

## Future Rohlik/MCP Integration

Use the `CartProvider` interface in `lib/cart/CartProvider.ts`.

Expected integration points:
- `lib/cart/RohlikCartProvider.ts`
- a future server-side API route if session, token, MCP, or credential handling is needed

Mark future integration points with:

```ts
TODO(integration):
```

SECURITY: Rohlik credentials must never be stored in frontend code. Real order confirmation must happen on the merchant side.

## Files Not To Modify Casually

- `lib/cart/CartProvider.ts` - provider contract used by all cart implementations
- `lib/grocery/types.ts` - shared parser/cart UI contract
- `app/layout.tsx` - metadata, analytics, root shell
- `app/config/analytics.ts` - analytics configuration
- `next.config.ts`, `tsconfig.json`, `tailwind.config.ts` - project tooling configuration

## Validation Checklist Before Committing

- `npm run lint`
- `npm run build`
- Confirm `/`, `/demo`, and `/docs` still render.
- Confirm unsupported speech browsers still have textarea fallback.
- Confirm no real merchant API, auth, payment, or order placement was added.
- Confirm security-sensitive notes use `SECURITY:` where appropriate.
- Confirm future integration markers use `TODO(integration):` only for real expected integration points.
