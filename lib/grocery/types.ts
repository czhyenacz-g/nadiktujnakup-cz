// Shared grocery request types used by parsers, UI components, and cart providers.
export interface GroceryItem {
  id: string;
  name: string;
  quantity?: string;
  category?: string;
  note?: string;
  confidence: number;
}

export interface ParsedGroceryRequest {
  originalText: string;
  items: GroceryItem[];
  suggestions: string[];
  assumptions: string[];
}
