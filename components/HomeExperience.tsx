"use client";

import { useMemo, useState } from "react";
import { buildMockCartItems, MockCartProvider } from "@/lib/cart/MockCartProvider";
import type { CartItem, CartResult } from "@/lib/cart/CartProvider";
import { parseGroceryRequest } from "@/lib/grocery/parseGroceryRequest";
import type { ParsedGroceryRequest } from "@/lib/grocery/types";
import { CartPreview } from "./CartPreview";
import { GroceryList } from "./GroceryList";
import { Hero } from "./Hero";
import { StatusMessage } from "./StatusMessage";
import { VoiceInput } from "./VoiceInput";

type HomeStatus = "idle" | "processing" | "error";

const infoCards = [
  {
    title: "Rozpoznání",
    description: "Nadiktovaný nebo napsaný text se převede na strukturovaný seznam.",
  },
  {
    title: "Demo košík",
    description: "Zobrazíme, jak by košík vypadal po rozpoznání položek.",
  },
  {
    title: "Bez objednávky",
    description: "Toto je demo. Aplikace nevytváří skutečné objednávky.",
  },
];

function waitForDemoProcessing() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 450);
  });
}

function HomeInfoCards() {
  return (
    <div className="mx-auto mt-3 grid max-w-3xl gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3">
      {infoCards.map((card) => (
        <article
          key={card.title}
          className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-left shadow-sm sm:px-4 sm:py-3"
        >
          <div className="mb-1 flex items-center gap-2 sm:mb-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <h2 className="text-sm font-semibold text-zinc-950">{card.title}</h2>
          </div>
          <p className="text-xs leading-4 text-zinc-600 sm:leading-5">{card.description}</p>
        </article>
      ))}
    </div>
  );
}

// Client composition for the home page voice-to-cart demo.
export function HomeExperience() {
  const cartProvider = useMemo(() => new MockCartProvider(), []);
  const [status, setStatus] = useState<HomeStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [parsedRequest, setParsedRequest] = useState<ParsedGroceryRequest | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartResult, setCartResult] = useState<CartResult | null>(null);
  const [isPreparingCart, setIsPreparingCart] = useState(false);

  async function handleInputSubmit(text: string) {
    try {
      setStatus("processing");
      setErrorMessage(null);
      setCartResult(null);
      await waitForDemoProcessing();

      const parsed = parseGroceryRequest(text);
      setParsedRequest(parsed);
      setCartItems(buildMockCartItems(parsed));
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMessage("Požadavek se nepodařilo převést. Zkuste to prosím znovu.");
    }
  }

  async function handlePrepareCart() {
    if (!parsedRequest) {
      setStatus("error");
      setErrorMessage("Nejdříve zadejte nákupní požadavek.");
      return;
    }

    try {
      setIsPreparingCart(true);
      setErrorMessage(null);
      const result = await cartProvider.prepareCart(parsedRequest);
      setCartResult(result);
    } catch {
      setStatus("error");
      setErrorMessage("Demo košík se nepodařilo připravit.");
    } finally {
      setIsPreparingCart(false);
    }
  }

  function handleInputReset() {
    setStatus("idle");
    setErrorMessage(null);
    setParsedRequest(null);
    setCartItems([]);
    setCartResult(null);
    setIsPreparingCart(false);
  }

  return (
    <>
      <Hero>
        <VoiceInput
          hasError={status === "error"}
          isProcessing={status === "processing"}
          onReset={handleInputReset}
          onSubmit={handleInputSubmit}
        />
        <HomeInfoCards />
      </Hero>

      {errorMessage || parsedRequest ? (
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-2 sm:px-6 sm:pt-0 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              {errorMessage ? <StatusMessage tone="error">{errorMessage}</StatusMessage> : null}
              {parsedRequest ? <GroceryList parsedRequest={parsedRequest} /> : null}
            </div>
            <div className="space-y-5">
              {cartItems.length > 0 ? (
                <CartPreview
                  cartResult={cartResult}
                  isPreparing={isPreparingCart}
                  items={cartItems}
                  onPrepareCart={handlePrepareCart}
                />
              ) : (
                <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-5 text-sm leading-6 text-zinc-600">
                  Náhled demo košíku se objeví po rozpoznání položek.
                </div>
              )}
              <StatusMessage tone="warning">
                Toto je demo. Aplikace nevytváří skutečné objednávky a neukládá přihlašovací údaje k Rohlíku.
              </StatusMessage>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
