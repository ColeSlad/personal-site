"use client";

import { useSyncExternalStore } from "react";
import { activeAlternateSection } from "../lib/alternate-navigation";

function getCurrentSection() {
  return activeAlternateSection({
    work: document.getElementById("work")?.getBoundingClientRect().top,
    about: document.getElementById("about")?.getBoundingClientRect().top,
  }, window.innerHeight);
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

export default function AlternateHeader() {
  const active = useSyncExternalStore(subscribeToSection, getCurrentSection, () => "orbit");

  return (
    <header className="alternate-header">
      <nav className="alternate-navigation" aria-label="Space navigation">
        <a href="#orbit" aria-current={active === "orbit" ? "location" : undefined}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="3" stroke="currentColor" />
            <ellipse cx="10" cy="10" rx="9" ry="4" stroke="currentColor" transform="rotate(-35 10 10)" />
          </svg>
          Orbit
        </a>
        <a href="#work" aria-current={active === "work" ? "location" : undefined}>Work</a>
        <a href="#about" aria-current={active === "about" ? "location" : undefined}>About</a>
      </nav>
    </header>
  );
}
