import type { ParsedGroceryRequest } from "@/lib/grocery/types";

// Shared cart types keep provider implementations replaceable.
export interface CartItem {
  id: string;
  groceryItemId: string;
  displayName: string;
  quantity: string;
  estimatedPrice?: number;
  provider: "mock";
}

export interface CartResult {
  success: boolean;
  items: CartItem[];
  message: string;
}

export interface CartProvider {
  prepareCart(parsedRequest: ParsedGroceryRequest): Promise<CartResult>;
}
