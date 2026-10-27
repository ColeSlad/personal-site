import type { Metadata } from "next";
import { ThemeTransitionLink } from "../components/ThemeTransition";
import SpaceScene from "../components/SpaceScene";

export const metadata: Metadata = {
  title: "Another side — Cole Sladowsky",
  description: "A different orbit. Explore the other side of Cole Sladowsky’s site.",
};

export default function Alternate() {
  return (
    <main className="alternate-page">
      <SpaceScene />
      <header className="alternate-header">
        <span>cole sladowsky</span>
        <p className="alternate-eyebrow">a little further from ordinary</p>
        <ThemeTransitionLink href="/" className="alternate-back">← back to the original</ThemeTransitionLink>
      </header>

      <div className="alternate-content">
        <h1>another orbit.</h1>
        <p className="alternate-description">
          same person. a different universe.
          <br />the rest of this world is coming soon.
        </p>
      </div>

      <footer className="alternate-footer">
        <span>a work in orbit.</span>
        <span className="space-credit">
          textures: <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noopener noreferrer">Solar System Scope</a>
          {" / "}<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>
        </span>
      </footer>
    </main>
  );
}
