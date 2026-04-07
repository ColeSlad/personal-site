import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        {children}
      </body>
    </html>
  );
}
