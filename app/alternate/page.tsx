import type { Metadata } from "next";
import ThemeSwitch from "../components/ThemeSwitch";
import SpaceScene from "../components/SpaceScene";

export const metadata: Metadata = {
  title: "Another side — Cole Sladowsky",
  description: "Orbit Io, Jupiter’s colorful volcanic moon, on the other side of Cole Sladowsky’s site.",
};

export default function Alternate() {
  return (
    <main className="alternate-page" data-space-ready="false">
      <ThemeSwitch returnToMain />
      <SpaceScene />
      <h1 className="sr-only">Cole Sladowsky</h1>
      <header className="alternate-header">
        <span className="alternate-name">cole sladowsky</span>
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
