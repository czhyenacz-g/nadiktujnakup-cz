import type { ParsedGroceryRequest } from "@/lib/grocery/types";
import type { CartItem, CartProvider, CartResult } from "./types";

const DEFAULT_ESTIMATED_PRICE = 49;

const PRICE_BY_CATEGORY: Record<string, number> = {
  "Mléčné výrobky": 45,
  "Základní potraviny": 55,
  "Ovoce a zelenina": 59,
  Pečivo: 35,
  Lahůdky: 69,
  "Hotová a rychlá jídla": 89,
  "Trvanlivé potraviny": 39,
  "Maso a ryby": 129,
};

// Builds deterministic cart preview data without talking to a real merchant.
export function buildMockCartItems(parsedRequest: ParsedGroceryRequest): CartItem[] {
  return parsedRequest.items.map((item, index) => ({
    id: `mock-cart-${index + 1}`,
    groceryItemId: item.id,
    displayName: item.name,
    quantity: item.quantity ?? "1 ks",
    estimatedPrice: item.category
      ? PRICE_BY_CATEGORY[item.category] ?? DEFAULT_ESTIMATED_PRICE
      : DEFAULT_ESTIMATED_PRICE,
    provider: "mock",
  }));
}

export class MockCartProvider implements CartProvider {
  async prepareCart(parsedRequest: ParsedGroceryRequest): Promise<CartResult> {
    const items = buildMockCartItems(parsedRequest);

    return {
      success: items.length > 0,
      items,
      message:
        items.length > 0
          ? "Demo košík připraven. Finální objednávku musí uživatel potvrdit v e-shopu."
          : "Nejdříve je potřeba rozpoznat alespoň jednu položku.",
    };
  }
}
