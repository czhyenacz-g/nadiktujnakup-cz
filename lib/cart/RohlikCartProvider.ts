import type { CartProvider, CartResult } from "./types";

// SECURITY: Real merchant credentials must never be stored in frontend code.
export class RohlikCartProvider implements CartProvider {
  async prepareCart(): Promise<CartResult> {
    // TODO(integration): Implement through a server-side Rohlik/MCP integration with secure session handling.
    throw new Error("RohlikCartProvider is a future integration placeholder.");
  }
}
