import type { Metadata } from "next";
import { EB_Garamond, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const eb_Garamond = EB_Garamond({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cole Sladowsky",
  description: "CS student at the University of Maryland — building full-stack apps, ML tools, and mobile software. Software engineer intern at MITRE.",
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
      <body className={`${eb_Garamond.variable} ${ibmPlexMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
