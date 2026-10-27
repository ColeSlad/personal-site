"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
} from "react";

type BloomOrigin = { x: number; y: number };
const ThemeNavigation = createContext<((href: string, origin: BloomOrigin | null) => void) | null>(null);

export function ThemeTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTransition = useRef<ViewTransition | null>(null);
  const routeCommitted = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    // Start the transition as soon as the route commits. The scene keeps its
    // planets hidden until their textures are ready, independently of navigation.
    routeCommitted.current?.();
    routeCommitted.current = null;
  }, [pathname]);

  useLayoutEffect(() => () => {
    routeCommitted.current?.();
    activeTransition.current?.skipTransition();
  }, []);

  const navigate = useCallback((href: string, origin: BloomOrigin | null) => {
    if (activeTransition.current) return;

    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    const root = document.documentElement;
    root.dataset.themeSwap = href === "/alternate" ? "alternate" : "original";
    root.dataset.themePhase = "capturing";
    root.style.setProperty("--theme-origin-x", `${origin?.x ?? window.innerWidth}px`);
    root.style.setProperty("--theme-origin-y", `${origin?.y ?? window.innerHeight / 2}px`);
    const transition = document.startViewTransition(() => new Promise<void>((resolve) => {
      // Never keep the browser's snapshot frozen if navigation is interrupted.
      const timeout = window.setTimeout(resolve, 3500);
      routeCommitted.current = () => {
        window.clearTimeout(timeout);
        resolve();
      };
      router.push(href);
    }));
    activeTransition.current = transition;

    void transition.ready.then(() => {
      // GPU setup can begin after the browser has captured the new page, so it
      // cannot hold up the first frame of the color transition.
      root.dataset.themePhase = "revealing";
      if (href === "/alternate") window.dispatchEvent(new Event("theme-revealing"));
    }).catch(() => {
      // The finished handler still releases scene setup if animation is skipped.
    });

    void transition.finished.catch(() => {
      // A skipped browser animation should not interfere with navigation.
    }).finally(() => {
      routeCommitted.current?.();
      routeCommitted.current = null;
      activeTransition.current = null;
      delete root.dataset.themeSwap;
      delete root.dataset.themePhase;
      root.style.removeProperty("--theme-origin-x");
      root.style.removeProperty("--theme-origin-y");
      if (href === "/alternate") window.dispatchEvent(new Event("theme-arrived"));
    });
  }, [router]);

  return <ThemeNavigation.Provider value={navigate}>{children}</ThemeNavigation.Provider>;
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
