"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

function getOrbitSection() {
  const work = document.getElementById("work");
  return work && work.getBoundingClientRect().top <= window.innerHeight * 0.4 ? "work" : "orbit";
}

function subscribeToSection(onChange: () => void) {
  let frame = 0;
  const update = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      onChange();
    });
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  window.addEventListener("hashchange", update);
  window.addEventListener("pageshow", update);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
    window.removeEventListener("hashchange", update);
    window.removeEventListener("pageshow", update);
  };
}

export default function AlternateHeader({ current }: { current: "orbit" | "about" }) {
  const orbitSection = useSyncExternalStore(subscribeToSection, getOrbitSection, () => "orbit");
  const active = current === "about" ? "about" : orbitSection;

  return (
    <header className="alternate-header">
      <nav className="alternate-navigation" aria-label="Space navigation">
        <Link href="/alternate" aria-current={active === "orbit" ? "page" : undefined}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="3" stroke="currentColor" />
            <ellipse cx="10" cy="10" rx="9" ry="4" stroke="currentColor" transform="rotate(-35 10 10)" />
          </svg>
          Orbit
        </Link>
        <Link href="/alternate#work" aria-current={active === "work" ? "location" : undefined}>Work</Link>
        <Link href="/alternate/about" aria-current={active === "about" ? "page" : undefined}>About</Link>
      </nav>
    </header>
  );
}
