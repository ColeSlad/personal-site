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
    // Capture the destination with its detailed textures, rather than the
    // temporary material shown while the local images decode.
    let timeout: number | undefined;
    const release = () => {
      window.clearTimeout(timeout);
      window.removeEventListener("space-ready", release);
      routeCommitted.current?.();
      routeCommitted.current = null;
    };
    const scene = document.querySelector("[data-space-ready]");
    if (pathname === "/alternate" && scene?.getAttribute("data-space-ready") === "false") {
      window.addEventListener("space-ready", release, { once: true });
      timeout = window.setTimeout(release, 1200);
    } else release();

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("space-ready", release);
    };
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

    void transition.finished.catch(() => {
      // A skipped browser animation should not interfere with navigation.
    }).finally(() => {
      routeCommitted.current?.();
      routeCommitted.current = null;
      activeTransition.current = null;
      delete root.dataset.themeSwap;
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
