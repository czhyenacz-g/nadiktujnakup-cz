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

function waitForDemoProcessing() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 450);
  });
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

  return (
    <>
      <Hero>
        <VoiceInput
          hasError={status === "error"}
          isProcessing={status === "processing"}
          onSubmit={handleInputSubmit}
        />
      </Hero>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            {errorMessage ? <StatusMessage tone="error">{errorMessage}</StatusMessage> : null}
            {parsedRequest ? (
              <GroceryList parsedRequest={parsedRequest} />
            ) : (
              <StatusMessage tone="info">
                Nadiktovaný nebo napsaný text se zobrazí tady spolu se strukturovaným nákupním seznamem.
              </StatusMessage>
            )}
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
    </>
  );
}
