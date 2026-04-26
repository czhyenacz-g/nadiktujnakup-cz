import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { GOATCOUNTER_CODE } from "./config/analytics";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Nadiktuj nákup | Hlasový nákupní asistent",
  description: "Nadiktujte, co doma chybí, a získejte strukturovaný nákupní seznam s demo košíkem.",
  openGraph: {
    title: "Nadiktuj nákup",
    description: "Hlasový nákupní asistent pro strukturovaný demo košík.",
    url: "https://nadiktujnakup.cz",
    siteName: "Nadiktuj nákup",
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nadiktuj nákup",
    description: "Nadiktujte nákup a připravte strukturovaný demo košík.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs">
      <body className="bg-zinc-50 text-zinc-950 antialiased">
        <Navigation />
        <main>{children}</main>
        <Analytics />
        {GOATCOUNTER_CODE && (
          <Script
            data-goatcounter={`https://${GOATCOUNTER_CODE}.goatcounter.com/count`}
            src="//gc.zgo.at/count.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
