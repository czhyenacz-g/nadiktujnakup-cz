"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/demo", label: "Demo" },
  { href: "/docs", label: "Dokumentace" },
];

const desktopNavItems = navItems.filter((item) => item.href !== "/");

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {isOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}

// Top-level navigation shared by all public pages.
export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur">
      <nav
        className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Hlavní navigace"
      >
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-950">
          nadiktujnakup.cz
        </Link>
        <div className="hidden items-center gap-2 sm:flex">
          {desktopNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-800 transition hover:bg-zinc-100 sm:hidden"
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Zavřít navigaci" : "Otevřít navigaci"}
        >
          <MenuIcon isOpen={isMenuOpen} />
        </button>

        {isMenuOpen ? (
          <div
            id="mobile-navigation"
            className="absolute left-4 right-4 top-[calc(100%+0.5rem)] rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg sm:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
      </nav>
    </header>
  );
}
