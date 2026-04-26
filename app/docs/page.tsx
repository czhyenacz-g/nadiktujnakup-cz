import { Section } from "@/components/Section";
import { StatusMessage } from "@/components/StatusMessage";

const architectureFiles = [
  "app/page.tsx",
  "components/HomeExperience.tsx",
  "lib/grocery/parseGroceryRequest.ts",
  "lib/cart/MockCartProvider.ts",
  "lib/cart/RohlikCartProvider.ts",
  "lib/speech/useSpeechInput.ts",
];

export default function DocumentationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Dokumentace
        </p>
        <h1 className="text-4xl font-semibold text-zinc-950">Voice Grocery MVP</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-700">
          Přehled produktu, architektury a pravidel pro bezpečný budoucí rozvoj.
        </p>
      </div>

      <Section title="Project Overview">
        <p>
          Nadiktuj nákup je MVP hlasového nákupního asistenta. Uživatel řekne nebo napíše,
          co doma chybí, aplikace text převede na strukturovaný nákupní seznam a ukáže mock
          košík.
        </p>
      </Section>

      <Section title="Current MVP Scope">
        <ul className="list-disc space-y-2 pl-5">
          <li>Web Speech API v prohlížeči, pokud je dostupné.</li>
          <li>Ruční textové zadání jako bezpečný fallback.</li>
          <li>Deterministický český parser pro základní potraviny a vágní fráze.</li>
          <li>Mock cart provider bez reálného přihlášení, platby nebo objednávky.</li>
        </ul>
      </Section>

      <Section title="Architecture">
        <p>
          Stránky v <code>app/</code> skládají malé komponenty z <code>components/</code>.
          Business logika je v <code>lib/</code>, aby ji bylo možné měnit bez procházení UI.
        </p>
        <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4">
          <ul className="space-y-2 text-sm">
            {architectureFiles.map((file) => (
              <li key={file}>
                <code>{file}</code>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="Service Layer">
        <p>
          Grocery parser vrací typ <code>ParsedGroceryRequest</code>. Košík používá rozhraní
          <code> CartProvider</code>, takže mock i budoucí reálný provider mají stejný kontrakt.
        </p>
      </Section>

      <Section title="How Voice Input Works">
        <p>
          Hook <code>lib/speech/useSpeechInput.ts</code> detekuje <code>SpeechRecognition</code>
          nebo <code>webkitSpeechRecognition</code>. Pokud API není dostupné, UI zobrazí textové
          pole a aplikace dál funguje bez pádu.
        </p>
      </Section>

      <Section title="How Grocery Parsing Works">
        <p>
          Parser je záměrně deterministický. Rozpoznává české výrazy jako mléko, vajíčka,
          banány, pečivo, máslo, šunka, sýr, jogurty, ovoce, snídaně, oběd a večeře.
          Vágní fráze převádí na předvídatelné návrhy.
        </p>
      </Section>

      <Section title="How Mock Cart Works">
        <p>
          <code>MockCartProvider</code> převádí položky na demo košík s orientační cenou.
          Nevolá žádné externí API a nevytváří skutečné objednávky.
        </p>
      </Section>

      <Section title="Future Rohlik/MCP Integration">
        <p>
          TODO(integration): Reálný provider patří do <code>lib/cart/RohlikCartProvider.ts</code>
          nebo do server-side API route, pokud bude potřeba bezpečně držet session, tokeny nebo
          MCP spojení.
        </p>
        <StatusMessage tone="warning">
          SECURITY: Přihlašovací údaje k Rohlíku nikdy nepatří do frontendového kódu. Reálné
          potvrzení objednávky musí proběhnout na straně e-shopu.
        </StatusMessage>
      </Section>

      <Section title="Environment Variables">
        <p>
          MVP nepotřebuje žádné povinné env proměnné. Volitelný GoatCounter kód je v
          <code> app/config/analytics.ts</code>. TODO(integration): budoucí tajné hodnoty musí
          být server-side env proměnné ve Vercelu, ne v klientském bundlu.
        </p>
      </Section>

      <Section title="Deployment on Vercel">
        <p>
          Projekt je Vercel-ready Next.js App Router aplikace. Lokálně spusťte
          <code> npm run build</code>. Na Vercelu použijte standardní Next.js preset a Node.js
          runtime podle výchozí konfigurace projektu.
        </p>
      </Section>

      <Section title="Security Notes">
        <ul className="list-disc space-y-2 pl-5">
          <li>SECURITY: aplikace neukládá osobní data ani přihlašovací údaje.</li>
          <li>SECURITY: žádný reálný checkout není v MVP implementován.</li>
          <li>SECURITY: budoucí integrace s obchodníkem musí jít přes backend/server-side kód.</li>
        </ul>
      </Section>

      <Section title="Junior Developer Guide">
        <p>
          Pro změny UI začněte v <code>components/</code> a až potom otevřete route v
          <code> app/</code>. Pro změny parseru upravte <code>lib/grocery/</code>. Pro změny
          košíku upravte <code>lib/cart/</code>. Před commitem spusťte lint a build.
        </p>
      </Section>

      <Section title="Remaining TODOs">
        <ul className="list-disc space-y-2 pl-5">
          <li>TODO(integration): nahradit parser reálným AI parserem na serveru.</li>
          <li>TODO(integration): přidat Rohlik/MCP provider bez ukládání credentials ve frontendu.</li>
          <li>TODO(integration): doplnit backend session/auth handling.</li>
          <li>TODO(integration): navrhnout merchant confirmation flow.</li>
        </ul>
      </Section>
    </div>
  );
}
