import type { ReactNode } from "react";

interface HeroProps {
  children: ReactNode;
}

// Product hero for the main voice grocery experience.
export function Hero({ children }: HeroProps) {
  return (
    <section className="bg-white py-5 sm:py-10 lg:py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-xs">
            HLASOVÝ NÁKUPNÍ ASISTENT
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-zinc-950 sm:text-4xl lg:text-5xl">
            Nadiktujte nákup. Košík se připraví za vás.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:mt-4 sm:text-lg sm:leading-8">
            Řekněte, co doma chybí, nebo napište požadavek ručně. Aplikace z něj
            připraví strukturovaný nákupní seznam a ukáže demo košík.
          </p>
        </div>
        <div className="mt-5 w-full sm:mt-8">{children}</div>
      </div>
    </section>
  );
}
