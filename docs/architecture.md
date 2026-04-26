# Architecture

## App Flow

1. User opens `/`.
2. `components/HomeExperience.tsx` renders the hero, voice/manual input, parsed list, and mock cart preview.
3. `components/VoiceInput.tsx` uses `lib/speech/useSpeechInput.ts` when browser speech recognition is available.
4. Submitted text is parsed by `lib/grocery/parseGroceryRequest.ts`.
5. Parsed items are mapped to mock cart items by `lib/cart/MockCartProvider.ts`.
6. The `Připravit košík` button calls the mock cart provider and displays a success message.

The `/demo` page uses the same parser and mock cart builder with predefined prompts. The `/docs` page explains the project for humans and future AI agents.

## Service Boundaries

- UI composition: `app/`
- Reusable UI: `components/`
- Grocery parsing: `lib/grocery/`
- Cart provider contracts and implementations: `lib/cart/`
- Speech/Web API integration: `lib/speech/`

React components should not contain parser rules or cart provider behavior.

## Data Types

Core grocery types live in `lib/grocery/types.ts`:

- `GroceryItem`
- `ParsedGroceryRequest`

Core cart types live in `lib/cart/types.ts`:

- `CartItem`
- `CartResult`
- `CartProvider`

These contracts are intentionally explicit so a future AI parser or real cart provider can be swapped in with minimal UI changes.

## Mock vs Future Real Integration

Current MVP behavior is mocked:

- No real Rohlik login
- No real cart mutation
- No real checkout
- No credential storage

`MockCartProvider` is the only active provider. `RohlikCartProvider` exists as a placeholder for future work.

SECURITY: Rohlik credentials must never be shipped to the browser. Any real integration must happen server-side.

## Extension Points

- TODO(integration): Replace `parseGroceryRequest` with a server-side AI parser that still returns `ParsedGroceryRequest`.
- TODO(integration): Implement `RohlikCartProvider` behind the `CartProvider` interface.
- TODO(integration): Add a server-side API route for secure session/auth handling if needed.
- TODO(integration): Add a merchant-side confirmation flow so final order approval happens in the e-shop.
