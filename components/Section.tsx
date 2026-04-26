import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  eyebrow?: string;
  title: string;
}

// Reusable page section with consistent document and product spacing.
export function Section({ children, eyebrow, title }: SectionProps) {
  return (
    <section className="py-8 sm:py-10">
      <div className="mb-5">
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-semibold text-zinc-950 sm:text-3xl">{title}</h2>
      </div>
      <div className="text-base leading-7 text-zinc-700">{children}</div>
    </section>
  );
}
