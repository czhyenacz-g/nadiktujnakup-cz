import type { ParsedGroceryRequest } from "@/lib/grocery/types";
import { StatusMessage } from "./StatusMessage";

interface GroceryListProps {
  parsedRequest: ParsedGroceryRequest;
}

// Renders the structured parser result without owning parsing behavior.
export function GroceryList({ parsedRequest }: GroceryListProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Přepis</p>
        <p className="mt-2 text-zinc-900">{parsedRequest.originalText}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-zinc-950">Nákupní seznam</h3>
        {parsedRequest.items.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {parsedRequest.items.map((item) => (
              <article key={item.id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-zinc-950">{item.name}</h4>
                    <p className="mt-1 text-sm text-zinc-600">{item.quantity ?? "1 ks"}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                    {Math.round(item.confidence * 100)} %
                  </span>
                </div>
                {item.category ? <p className="mt-3 text-sm text-zinc-600">{item.category}</p> : null}
                {item.note ? <p className="mt-2 text-sm text-zinc-500">{item.note}</p> : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <StatusMessage tone="warning">Z požadavku zatím nevznikla žádná konkrétní položka.</StatusMessage>
          </div>
        )}
      </div>

      {parsedRequest.suggestions.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Doporučení</h3>
          <ul className="mt-2 space-y-2 text-sm text-zinc-700">
            {parsedRequest.suggestions.map((suggestion) => (
              <li key={suggestion}>{suggestion}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {parsedRequest.assumptions.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Předpoklady</h3>
          <ul className="mt-2 space-y-2 text-sm text-zinc-700">
            {parsedRequest.assumptions.map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
