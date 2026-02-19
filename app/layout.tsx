import type { Metadata } from "next";
import { VT323, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const vt323 = VT323({
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
  description: "Software engineer & CS student at the University of Maryland",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${vt323.variable} ${ibmPlexMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
