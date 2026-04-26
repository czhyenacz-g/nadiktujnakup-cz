# File Map

| File path | Purpose | Safe to edit? | Common reason to edit |
| --- | --- | --- | --- |
| `app/page.tsx` | Home page composition | yes | Change home layout entry point |
| `app/demo/page.tsx` | Demo page composition | yes | Change demo route composition |
| `app/docs/page.tsx` | Documentation page content | yes | Update visible docs |
| `app/layout.tsx` | Root layout, metadata, analytics, navigation shell | carefully | Change metadata or global shell |
| `app/globals.css` | Tailwind directives and global CSS | carefully | Add global CSS only when Tailwind is not enough |
| `components/Navigation.tsx` | Shared top navigation | yes | Add or rename navigation links |
| `components/Hero.tsx` | Home hero copy and layout | yes | Change main product messaging |
| `components/VoiceInput.tsx` | Microphone and fallback input | yes | Adjust voice UX or validation copy |
| `components/GroceryList.tsx` | Parsed grocery result UI | yes | Change list presentation |
| `components/CartPreview.tsx` | Mock cart preview and CTA UI | yes | Change cart preview presentation |
| `components/DemoPromptCard.tsx` | Demo prompt card UI | yes | Change prompt card styling |
| `components/StatusMessage.tsx` | Reusable status block | yes | Change status message styling |
| `components/Section.tsx` | Reusable documentation/page section | yes | Change section spacing |
| `components/HomeExperience.tsx` | Home client state composition | carefully | Change input-to-parser-to-cart flow |
| `components/DemoExperience.tsx` | Demo client state composition | carefully | Change demo selection flow |
| `lib/grocery/types.ts` | Grocery parser data contracts | carefully | Change shared parser types |
| `lib/grocery/parseGroceryRequest.ts` | Deterministic parser | yes | Change parsing behavior |
| `lib/grocery/demoPrompts.ts` | Demo prompt data | yes | Add or edit demo examples |
| `lib/cart/CartProvider.ts` | Provider interface export | carefully | Contract for all cart providers |
| `lib/cart/types.ts` | Cart provider data contracts | carefully | Change shared cart types |
| `lib/cart/MockCartProvider.ts` | Fake cart implementation | yes | Change demo cart behavior |
| `lib/cart/RohlikCartProvider.ts` | Future real provider placeholder | carefully | Real integration later |
| `lib/speech/useSpeechInput.ts` | Browser speech recognition hook | carefully | Change speech recognition behavior |
| `docs/architecture.md` | Human-readable architecture overview | yes | Explain architecture changes |
| `docs/ai-editing-guide.md` | Future AI/code-agent guide | yes | Update common edit instructions |
| `docs/decision-log.md` | Lightweight decision history | yes | Add architecture/product decisions |
| `docs/file-map.md` | Concise navigation table | yes | Update file ownership map |
| `AGENTS.md` | Primary AI-agent instructions | carefully | Change agent workflow |
| `CLAUDE.md` | Claude Code-specific notes | yes | Update Claude response conventions |
| `README.md` | Public project guide | yes | Update setup, usage, deployment |
