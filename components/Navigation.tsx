import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/demo", label: "Demo" },
  { href: "/docs", label: "Documentation" },
];

// Top-level navigation shared by all public pages.
export function Navigation() {
  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
        aria-label="Hlavní navigace"
      >
        <Link href="/" className="text-lg font-semibold text-zinc-950">
          Nadiktuj nákup
        </Link>
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
