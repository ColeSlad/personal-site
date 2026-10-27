import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeTransitionLink } from "../components/ThemeTransition";
import SpaceScene from "../components/SpaceScene";

const cinzel = localFont({
  src: "./fonts/Cinzel-Latin.woff2",
  variable: "--font-alternate-display",
  weight: "600 700",
  display: "swap",
});

const cormorant = localFont({
  src: [
    { path: "./fonts/CormorantGaramond-Latin.woff2", weight: "600", style: "normal" },
    { path: "./fonts/CormorantGaramond-Italic-Latin.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-alternate-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Another side — Cole Sladowsky",
  description: "Orbit Io, Jupiter’s colorful volcanic moon, on the other side of Cole Sladowsky’s site.",
};

export default function Alternate() {
  return (
    <main className={`alternate-page ${cinzel.variable} ${cormorant.variable}`}>
      <SpaceScene />
      <h1 className="sr-only">Cole Sladowsky</h1>
      <header className="alternate-header">
        <span className="alternate-name">cole sladowsky</span>
        <ThemeTransitionLink href="/" className="alternate-back">← back to the original</ThemeTransitionLink>
      </header>

      <footer className="alternate-footer">
        <span className="space-credit">
          Io: <a href="https://astrogeology.usgs.gov/search/map/io_galileo_ssi_voyager_color_merged_global_mosaic_1km" target="_blank" rel="noopener noreferrer">NASA/JPL/USGS</a>
          {" · Jupiter: "}<a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noopener noreferrer">Solar System Scope</a>
          {" / "}<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>
        </span>
      </footer>
    </main>
  );
}
