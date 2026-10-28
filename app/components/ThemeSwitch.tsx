"use client";

import { useCallback, useEffect, useRef, type PointerEvent } from "react";
import { ThemeTransitionLink } from "./ThemeTransition";

export default function ThemeSwitch({ returnToMain = false }: { returnToMain?: boolean }) {
  const activeLink = useRef<HTMLAnchorElement | null>(null);
  const frame = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const stopAura = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    if (activeLink.current) delete activeLink.current.dataset.auraActive;
    activeLink.current = null;
    window.dispatchEvent(new CustomEvent("gravity-warp", { detail: { strength: 0 } }));
  }, []);

  useEffect(() => stopAura, [stopAura]);

  function startAura(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    stopAura();
    const link = event.currentTarget;
    const bounds = link.getBoundingClientRect();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    pointer.current = { x: event.clientX, y: event.clientY };
    activeLink.current = link;
    link.dataset.auraActive = "true";
    let x = event.clientX;
    let y = event.clientY;
    let previous = 0;
    link.style.setProperty("--aura-y", `${y - bounds.top}px`);
    link.style.setProperty("--aura-x", `${x - bounds.left}px`);

    function follow(now: number) {
      if (!activeLink.current || motion.matches) { stopAura(); return; }
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 1 / 60;
      previous = now;
      const ease = 1 - Math.exp(-8 * dt);
      x += (pointer.current.x - x) * ease;
      y += (pointer.current.y - y) * ease;
      link.style.setProperty("--aura-y", `${y - bounds.top}px`);
      link.style.setProperty("--aura-x", `${x - bounds.left}px`);
      window.dispatchEvent(new CustomEvent("gravity-warp", { detail: {
        x: x / window.innerWidth,
        y: 1 - y / window.innerHeight,
        strength: 0.22,
      } }));
      frame.current = requestAnimationFrame(follow);
    }

    frame.current = requestAnimationFrame(follow);
  }

  return (
    <ThemeTransitionLink
      href={returnToMain ? "/" : "/alternate"}
      className={`theme-switch${returnToMain ? " theme-switch-return" : ""}`}
      aria-label={returnToMain ? "Back to the main page" : "Explore the alternate version of this site"}
      onPointerEnter={startAura}
      onPointerMove={(event) => { pointer.current = { x: event.clientX, y: event.clientY }; }}
      onPointerLeave={stopAura}
      onPointerCancel={stopAura}
      onClick={stopAura}
    >
      <span className="theme-switch-label">{returnToMain ? "back to main" : "another side"}</span>
      <span className="switch-aura" aria-hidden="true">
        <span className="switch-aura-cloud">
          <span className="switch-aura-layer switch-aura-violet" />
          <span className="switch-aura-layer switch-aura-rose" />
          <span className="switch-aura-layer switch-aura-warm" />
        </span>
      </span>
    </ThemeTransitionLink>
  );
}
