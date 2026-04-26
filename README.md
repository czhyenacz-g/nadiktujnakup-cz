# Nadiktuj nákup

Voice Grocery MVP for a Czech grocery assistant. A user dictates or types what is missing at home, the app converts the request into a structured shopping list, and a mocked cart provider shows a demo cart preview.

This MVP does not place real orders, store Rohlik credentials, authenticate users, take payments, or call real AI/Rohlik/MCP APIs.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Vercel Analytics
- Vercel-ready deployment

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Folder Structure

```text
app/
  page.tsx
  demo/page.tsx
  docs/page.tsx
  layout.tsx
  globals.css
components/
  Navigation.tsx
  Hero.tsx
  VoiceInput.tsx
  GroceryList.tsx
  CartPreview.tsx
  DemoPromptCard.tsx
  StatusMessage.tsx
  Section.tsx
lib/
  grocery/
  cart/
  speech/
docs/
```

## Architecture

Route files in `app/` compose the page. Reusable UI lives in `components/`. Business behavior lives in `lib/`.

- `lib/grocery/parseGroceryRequest.ts` handles deterministic grocery parsing.
- `lib/cart/CartProvider.ts` exports the cart provider contract.
- `lib/cart/MockCartProvider.ts` implements demo cart behavior.
- `lib/cart/RohlikCartProvider.ts` is the placeholder for future real integration.
- `lib/speech/useSpeechInput.ts` wraps browser speech recognition with a safe fallback path.

## Run Locally

```bash
npm run dev
```

Then visit:

- `/` for the main voice grocery demo
- `/demo` for predefined examples
- `/docs` for project documentation

## Deploy To Vercel

Use the standard Vercel Next.js preset.

```bash
npm run build
```

Push to the connected GitHub repository or deploy through the Vercel CLI.

## Future Rohlik/MCP Integration

TODO(integration): Implement a real provider through `lib/cart/RohlikCartProvider.ts` or a server-side API route.

SECURITY: Rohlik credentials must never be stored in frontend code. Use backend/server-side code for sessions, tokens, MCP calls, and merchant communication.

SECURITY: Real order confirmation must happen on the merchant side. The app should prepare or suggest a cart, not silently complete checkout.

## Known Limitations

- Browser speech recognition support varies by browser.
- Parser is deterministic and recognizes only selected Czech grocery words and meal phrases.
- Cart integration is mocked.
- Prices are rough demo estimates.
- No database, auth, analytics events, or payments are implemented.

## Next Steps

- TODO(integration): Replace deterministic parser with a server-side AI parser.
- TODO(integration): Add real Rohlik/MCP provider behind the `CartProvider` interface.
- TODO(integration): Add backend auth/session handling for secure merchant integration.
- Test production UX on mobile browsers.

## AI Maintenance

- Main AI-agent instructions: [AGENTS.md](AGENTS.md)
- AI editing guide: [docs/ai-editing-guide.md](docs/ai-editing-guide.md)
- File map: [docs/file-map.md](docs/file-map.md)
