import type { DemoPrompt } from "@/lib/grocery/demoPrompts";

interface DemoPromptCardProps {
  isSelected?: boolean;
  onSelect: () => void;
  prompt: DemoPrompt;
}

// Clickable prompt example used on the demo page.
export function DemoPromptCard({ isSelected = false, onSelect, prompt }: DemoPromptCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-lg border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        isSelected ? "border-emerald-500 bg-emerald-50" : "border-zinc-200 bg-white"
      }`}
    >
      <p className="text-sm font-semibold text-zinc-950">{prompt.text}</p>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{prompt.explanation}</p>
    </button>
  );
}
