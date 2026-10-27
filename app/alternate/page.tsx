import type { Metadata } from "next";
import { ThemeTransitionLink } from "../components/ThemeTransition";

export const metadata: Metadata = {
  title: "Another side — Cole Sladowsky",
  description: "A second version of Cole Sladowsky’s site. Coming soon.",
};

export default function Alternate() {
  return (
    <main className="alternate-page">
      <header className="alternate-header">
        <span>cole sladowsky</span>
      </header>

      <div className="alternate-content">
        <p className="alternate-eyebrow">a change of scenery</p>
        <h1>another side.</h1>
        <p className="alternate-description">
          a different version of this site is coming soon.
        </p>
        <ThemeTransitionLink href="/" className="alternate-back">← back to the original</ThemeTransitionLink>
      </div>

      <footer className="alternate-footer">same person. different perspective.</footer>
    </main>
  );
}
