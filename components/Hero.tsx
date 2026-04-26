import type { ReactNode } from "react";

interface HeroProps {
  children: ReactNode;
}

// Product hero for the main voice grocery experience.
export function Hero({ children }: HeroProps) {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-center lg:px-8">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Hlasový nákupní asistent
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
            Nadiktujte nákup. Košík se připraví za vás.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-700">
            Řekněte, co doma chybí, nebo napište požadavek ručně. Aplikace z něj
            připraví strukturovaný nákupní seznam a ukáže demo košík bez skutečné
            objednávky.
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}
