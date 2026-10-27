import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeTransitionProvider } from "./components/ThemeTransition";
import SiteLoader from "./components/SiteLoader";
import { kumbhSans } from "./lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cole Sladowsky",
  description: "CS student at the University of Maryland — building full-stack apps, ML tools, and mobile software. Software engineer intern at Visa.",
  authors: [{ name: "Cole Sladowsky" }],
  openGraph: {
    title: "Cole Sladowsky",
    description: "CS student at the University of Maryland — building full-stack apps, ML tools, and mobile software.",
    url: "https://colesladowsky.com",
    siteName: "Cole Sladowsky",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cole Sladowsky",
    description: "CS student at the University of Maryland — building full-stack apps, ML tools, and mobile software.",
  },
  metadataBase: new URL("https://colesladowsky.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/space/io-8k.webp" fetchPriority="high" />
        <link rel="preload" as="image" href="/space/jupiter-4k.webp" fetchPriority="high" />
      </head>
      <body className={kumbhSans.variable}>
        <SiteLoader>
          <ThemeTransitionProvider>{children}</ThemeTransitionProvider>
        </SiteLoader>
        <Analytics />
      </body>
    </html>
  );
}
