import type { CartItem, CartResult } from "@/lib/cart/CartProvider";
import { StatusMessage } from "./StatusMessage";

interface CartPreviewProps {
  cartResult?: CartResult | null;
  isPreparing?: boolean;
  items: CartItem[];
  onPrepareCart?: () => void;
}

// Mock cart preview. Real cart preparation belongs in a CartProvider implementation.
export function CartPreview({ cartResult, isPreparing = false, items, onPrepareCart }: CartPreviewProps) {
  const total = items.reduce((sum, item) => sum + (item.estimatedPrice ?? 0), 0);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Mock cart</p>
          <h3 className="mt-1 text-lg font-semibold text-zinc-950">Náhled demo košíku</h3>
        </div>
        <p className="text-sm font-semibold text-zinc-700">Odhad {total} Kč</p>
      </div>

      <div className="mt-4 divide-y divide-zinc-200 rounded-lg border border-zinc-200">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-zinc-950">{item.displayName}</p>
              <p className="mt-1 text-sm text-zinc-500">{item.quantity}</p>
            </div>
            {item.estimatedPrice ? (
              <p className="shrink-0 text-sm font-semibold text-zinc-700">{item.estimatedPrice} Kč</p>
            ) : null}
          </div>
        ))}
      </div>

      {onPrepareCart ? (
        <button
          type="button"
          onClick={onPrepareCart}
          disabled={isPreparing || items.length === 0}
          className="mt-5 w-full rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPreparing ? "Připravuji demo košík" : "Připravit košík"}
        </button>
      ) : null}

      {cartResult ? (
        <div className="mt-4">
          <StatusMessage tone={cartResult.success ? "success" : "error"}>{cartResult.message}</StatusMessage>
        </div>
      ) : null}
    </div>
  );
}
