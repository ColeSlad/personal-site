"use client";

import { useCallback, useEffect, useId, useRef, type PointerEvent } from "react";
import { ThemeTransitionLink } from "./ThemeTransition";

export default function ThemeSwitch({ returnToMain = false }: { returnToMain?: boolean }) {
  const lensFilterId = `mode-lens-${useId()}`;
  const activeLink = useRef<HTMLAnchorElement | null>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const lensMap = useRef<SVGFEImageElement>(null);
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
    const direction = returnToMain ? -1 : 1;
    // Center the lens inside the visible page rather than behind the solid rail.
    const lensX = returnToMain ? bounds.right + 72 : bounds.left - 72;
    const lensRadius = Math.min(290, window.innerWidth * 0.32);
    lensMap.current?.setAttribute("width", `${lensRadius * 2}`);
    lensMap.current?.setAttribute("height", `${lensRadius * 1.8}`);
    pointer.current = { x: event.clientX, y: event.clientY };
    activeLink.current = link;
    link.dataset.auraActive = "true";
    let x = event.clientX;
    let y = event.clientY;
    let previous = 0;
    let pull = 0;
    if (cursor.current) cursor.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    link.style.setProperty("--aura-y", `${y - bounds.top}px`);
    link.style.setProperty("--aura-x", `${x - bounds.left}px`);
    link.style.setProperty("--aura-pull", "0");
    link.style.setProperty("--lens-x", `${lensX}px`);
    link.style.setProperty("--lens-y", `${y}px`);

    function follow(now: number) {
      if (!activeLink.current || motion.matches) { stopAura(); return; }
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 1 / 60;
      previous = now;
      const ease = 1 - Math.exp(-8 * dt);
      pull += (1 - pull) * (1 - Math.exp(-3.5 * dt));
      const targetX = Math.max(5, Math.min(window.innerWidth - 5, pointer.current.x + direction * 28 * pull));
      x += (targetX - x) * ease;
      y += (pointer.current.y - y) * ease;
      if (cursor.current) cursor.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      link.style.setProperty("--aura-y", `${y - bounds.top}px`);
      link.style.setProperty("--aura-x", `${x - bounds.left}px`);
      link.style.setProperty("--aura-pull", `${pull}`);
      link.style.setProperty("--lens-y", `${y}px`);
      window.dispatchEvent(new CustomEvent("gravity-warp", { detail: {
        x: lensX / window.innerWidth,
        y: 1 - y / window.innerHeight,
        strength: pull,
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
      <svg className="switch-lens-defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id={lensFilterId} colorInterpolationFilters="sRGB">
            <feComponentTransfer in="SourceGraphic" result="opaque-backdrop">
              <feFuncA type="linear" slope="0" intercept="1" />
            </feComponentTransfer>
            <feImage ref={lensMap} href="/space/hover-lens-map.png" x="0" y="0" width="580" height="522" preserveAspectRatio="none" result="lens-map" />
            <feDisplacementMap in="opaque-backdrop" in2="lens-map" scale="180" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <span className="switch-page-lens" aria-hidden="true" style={{
        backdropFilter: `url("#${lensFilterId}")`,
        WebkitBackdropFilter: `url("#${lensFilterId}")`,
      }} />
      <span ref={cursor} className="switch-aura-cursor" aria-hidden="true" />
    </ThemeTransitionLink>
  );
}
