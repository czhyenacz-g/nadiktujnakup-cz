"use client";

import { useMemo, useState } from "react";
import { buildMockCartItems } from "@/lib/cart/MockCartProvider";
import type { CartItem } from "@/lib/cart/CartProvider";
import { demoPrompts, type DemoPrompt } from "@/lib/grocery/demoPrompts";
import { parseGroceryRequest } from "@/lib/grocery/parseGroceryRequest";
import type { ParsedGroceryRequest } from "@/lib/grocery/types";
import { CartPreview } from "./CartPreview";
import { DemoPromptCard } from "./DemoPromptCard";
import { GroceryList } from "./GroceryList";
import { Section } from "./Section";
import { StatusMessage } from "./StatusMessage";

// Client composition for demo prompts that do not require microphone access.
export function DemoExperience() {
  const initialPrompt = demoPrompts[0];
  const [selectedPrompt, setSelectedPrompt] = useState<DemoPrompt>(initialPrompt);
  const [parsedRequest, setParsedRequest] = useState<ParsedGroceryRequest>(() =>
    parseGroceryRequest(initialPrompt.text),
  );
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    buildMockCartItems(parseGroceryRequest(initialPrompt.text)),
  );

  const selectedPromptId = useMemo(() => selectedPrompt.id, [selectedPrompt]);

  function handlePromptSelect(prompt: DemoPrompt) {
    const parsed = parseGroceryRequest(prompt.text);
    setSelectedPrompt(prompt);
    setParsedRequest(parsed);
    setCartItems(buildMockCartItems(parsed));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Demo bez mikrofonu
        </p>
        <h1 className="text-4xl font-semibold text-zinc-950">Vyzkoušejte předpřipravené požadavky</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-700">
          Klikněte na příklad a uvidíte, jak deterministický MVP parser vytvoří seznam a demo košík.
        </p>
      </div>

      <Section title="Příklady požadavků">
        <div className="grid gap-4 md:grid-cols-2">
          {demoPrompts.map((prompt) => (
            <DemoPromptCard
              key={prompt.id}
              isSelected={prompt.id === selectedPromptId}
              onSelect={() => handlePromptSelect(prompt)}
              prompt={prompt}
            />
          ))}
        </div>
      </Section>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <StatusMessage tone="info">{selectedPrompt.explanation}</StatusMessage>
          <GroceryList parsedRequest={parsedRequest} />
        </div>
        <CartPreview items={cartItems} />
      </div>
    </div>
  );
}
