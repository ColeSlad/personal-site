"use client";

import { useCallback, useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { ThemeTransitionLink } from "./ThemeTransition";

export default function ThemeSwitch({ returnToMain = false }: { returnToMain?: boolean }) {
  const activeLink = useRef<HTMLAnchorElement | null>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const stopGravity = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    if (activeLink.current) delete activeLink.current.dataset.gravityActive;
    activeLink.current = null;
  }, []);

  useEffect(() => stopGravity, [stopGravity]);

  function startGravity(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    stopGravity();
    const link = event.currentTarget;
    const bounds = link.getBoundingClientRect();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const direction = returnToMain ? -1 : 1;
    pointer.current = { x: event.clientX, y: event.clientY };
    activeLink.current = link;
    link.dataset.gravityActive = "true";
    let x = event.clientX;
    let y = event.clientY;
    let wellY = y - bounds.top;
    let previous = 0;
    if (cursor.current) cursor.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    link.style.setProperty("--gravity-y", `${wellY}px`);

    function attract(now: number) {
      if (!activeLink.current || motion.matches) { stopGravity(); return; }
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 1 / 60;
      previous = now;
      const ease = 1 - Math.exp(-12 * dt);
      const targetX = Math.max(5, Math.min(window.innerWidth - 5, pointer.current.x + direction * 26));
      x += (targetX - x) * ease;
      y += (pointer.current.y - y) * ease;
      wellY += (pointer.current.y - bounds.top - wellY) * ease;
      if (cursor.current) cursor.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      link.style.setProperty("--gravity-y", `${wellY}px`);
      frame.current = requestAnimationFrame(attract);
    }

    frame.current = requestAnimationFrame(attract);
  }

  return (
    <ThemeTransitionLink
      href={returnToMain ? "/" : "/alternate"}
      className={`theme-switch${returnToMain ? " theme-switch-return" : ""}`}
      aria-label={returnToMain ? "Back to the main page" : "Explore the alternate version of this site"}
      onPointerEnter={startGravity}
      onPointerMove={(event) => { pointer.current = { x: event.clientX, y: event.clientY }; }}
      onPointerLeave={stopGravity}
      onPointerCancel={stopGravity}
      onClick={stopGravity}
    >
      <span className="theme-switch-label">{returnToMain ? "back to main" : "another side"}</span>
      <span className="gravity-field" aria-hidden="true">
        <span className="gravity-well">
          <span className="gravity-halo" />
          <span className="gravity-disc" />
          <span className="gravity-disc gravity-disc-inner" />
          {Array.from({ length: 14 }, (_, index) => (
            <span key={index} className="gravity-particle" style={{
              "--particle-y": `${(index % 2 ? 1 : -1) * (24 + index * 10)}px`,
              "--particle-delay": `${index * -0.17}s`,
              "--particle-duration": `${1.1 + (index % 4) * 0.18}s`,
            } as CSSProperties} />
          ))}
        </span>
      </span>
      <span ref={cursor} className="gravity-cursor" aria-hidden="true"><span /></span>
    </ThemeTransitionLink>
  );
}
