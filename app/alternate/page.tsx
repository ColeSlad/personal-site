import type { Metadata } from "next";
import ThemeSwitch from "../components/ThemeSwitch";
import AlternateHeader from "../components/AlternateHeader";
import SpaceCredits from "../components/SpaceCredits";

export const metadata: Metadata = {
  title: "Another side — Cole Sladowsky",
  description: "Orbit Io, Jupiter’s colorful volcanic moon, on the other side of Cole Sladowsky’s site.",
};

export default function Alternate() {
  return (
    <main className="alternate-page">
      <ThemeSwitch returnToMain />
      <h1 className="sr-only">Cole Sladowsky</h1>
      <AlternateHeader current="orbit" />

      <footer className="alternate-footer">
        <SpaceCredits />
      </footer>
    </main>
  );
}
