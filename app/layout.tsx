import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeTransitionProvider } from "./components/ThemeTransition";
import SiteLoader from "./components/SiteLoader";
import { kumbhSans } from "./lib/fonts";
import "./globals.css";

const siteDescription = "Cole Sladowsky — CS student and Presidential Scholar at the University of Maryland, obsessed with efficiency, low-level systems, and making things run well.";

export const metadata: Metadata = {
  title: "Cole Sladowsky",
  description: siteDescription,
  authors: [{ name: "Cole Sladowsky" }],
  openGraph: {
    title: "Cole Sladowsky",
    description: siteDescription,
    url: "https://colesladowsky.com",
    siteName: "Cole Sladowsky",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cole Sladowsky",
    description: siteDescription,
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
