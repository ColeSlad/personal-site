"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";

type BloomOrigin = { x: number; y: number };
type ThemeSwap = BloomOrigin & { href: string; scale: number; phase: "covering" | "waiting" | "revealing" };
const ThemeNavigation = createContext<((href: string, origin: BloomOrigin | null) => void) | null>(null);

export function ThemeTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [swap, setSwap] = useState<ThemeSwap | null>(null);
  const activeTransition = useRef<ThemeSwap | null>(null);
  const routeCommitted = useRef<(() => void) | null>(null);
  const timers = useRef<number[]>([]);
  const revealFrame = useRef(0);

  const finish = useCallback(() => {
    const current = activeTransition.current;
    if (!current) return;
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    cancelAnimationFrame(revealFrame.current);
    routeCommitted.current = null;
    activeTransition.current = null;
    delete document.documentElement.dataset.themeSwap;
    delete document.documentElement.dataset.themePhase;
    setSwap(null);
    if (current.href === "/alternate") window.dispatchEvent(new Event("theme-arrived"));
  }, []);

  const reveal = useCallback(() => {
    const current = activeTransition.current;
    if (!current || current.phase === "revealing") return;
    const next: ThemeSwap = { ...current, phase: "revealing" };
    activeTransition.current = next;
    document.documentElement.dataset.themePhase = "revealing";
    setSwap(next);
    window.dispatchEvent(new Event("theme-revealing"));
    timers.current.push(window.setTimeout(finish, 1250));
  }, [finish]);

  const navigateUnderCover = useCallback(() => {
    const current = activeTransition.current;
    if (!current || current.phase !== "covering") return;
    const next: ThemeSwap = { ...current, phase: "waiting" };
    activeTransition.current = next;
    document.documentElement.dataset.themePhase = "waiting";
    setSwap(next);
    routeCommitted.current = () => { revealFrame.current = requestAnimationFrame(reveal); };
    timers.current.push(window.setTimeout(finish, 4000));
    router.push(current.href);
  }, [router, reveal, finish]);

  useLayoutEffect(() => {
    if (activeTransition.current?.href === pathname) {
      routeCommitted.current?.();
      routeCommitted.current = null;
    }
  }, [pathname]);

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    cancelAnimationFrame(revealFrame.current);
    routeCommitted.current = null;
    activeTransition.current = null;
    delete document.documentElement.dataset.themeSwap;
    delete document.documentElement.dataset.themePhase;
  }, []);

  const navigate = useCallback((href: string, origin: BloomOrigin | null) => {
    if (activeTransition.current || href === pathname) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    const root = document.documentElement;
    root.dataset.themeSwap = href === "/alternate" ? "alternate" : "original";
    root.dataset.themePhase = "covering";
    const x = Math.max(0, Math.min(window.innerWidth, origin?.x ?? (href === "/alternate" ? window.innerWidth : 0)));
    const y = Math.max(0, Math.min(window.innerHeight, origin?.y ?? window.innerHeight / 2));
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition: ThemeSwap = { href, x, y, scale: radius * 1.35 / 80, phase: "covering" };
    activeTransition.current = transition;
    // Animate first. Route rendering begins only once the color field covers
    // the page, without asking Chrome to capture old/new page screenshots.
    setSwap(transition);
    timers.current.push(window.setTimeout(navigateUnderCover, 600));
  }, [router, pathname, navigateUnderCover]);

  return (
    <ThemeNavigation.Provider value={navigate}>
      {children}
      {swap && (
        <div className="theme-curtain" data-phase={swap.phase} aria-hidden="true" style={{
          "--curtain-x": `${swap.x}px`,
          "--curtain-y": `${swap.y}px`,
          "--curtain-scale": swap.scale,
        } as CSSProperties}>
          <div className="theme-curtain-orb" onAnimationEnd={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.animationName === "themeCurtainCover") navigateUnderCover();
            if (event.animationName === "themeCurtainReveal") finish();
          }} />
        </div>
      )}
    </ThemeNavigation.Provider>
  );
}

type ThemeTransitionLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & {
  href: string;
};

export function ThemeTransitionLink({ href, onClick, ...props }: ThemeTransitionLinkProps) {
  const navigate = useContext(ThemeNavigation);
  const origin = useRef<BloomOrigin | null>(null);

  return (
    <Link
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        const bounds = event.currentTarget.getBoundingClientRect();
        origin.current = event.detail === 0
          ? { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 }
          : { x: event.clientX, y: event.clientY };
      }}
      onNavigate={(event) => {
        if (!navigate) return;
        event.preventDefault();
        navigate(href, origin.current);
      }}
    />
  );
}
