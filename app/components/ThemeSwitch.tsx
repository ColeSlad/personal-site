"use client";

import { useCallback, useEffect } from "react";
import { preload } from "react-dom";
import { useRouter } from "next/navigation";
import { ThemeTransitionLink } from "./ThemeTransition";

export default function ThemeSwitch({ returnToMain = false }: { returnToMain?: boolean }) {
  const router = useRouter();
  const prepareSpace = useCallback(() => {
    if (returnToMain) return;
    router.prefetch("/alternate");
    preload("/space/io-8k.webp", { as: "image", fetchPriority: "low" });
    preload("/space/jupiter-4k.webp", { as: "image", fetchPriority: "low" });
  }, [returnToMain, router]);

  useEffect(() => {
    if (returnToMain) return;
    // Warm the large texture requests after the homepage's initial render.
    if ("requestIdleCallback" in window) {
      const idle = window.requestIdleCallback(prepareSpace, { timeout: 1500 });
      return () => window.cancelIdleCallback(idle);
    }
    const timeout = setTimeout(prepareSpace, 300);
    return () => clearTimeout(timeout);
  }, [prepareSpace, returnToMain]);

  return (
    <ThemeTransitionLink
      href={returnToMain ? "/" : "/alternate"}
      className={`theme-switch${returnToMain ? " theme-switch-return" : ""}`}
      aria-label={returnToMain ? "Back to the main page" : "Explore the alternate version of this site"}
      onPointerEnter={prepareSpace}
      onFocus={prepareSpace}
      onPointerDown={prepareSpace}
    >
      <span className="theme-switch-label">{returnToMain ? "back to main" : "another side"}</span>
      <span className="theme-switch-arrow" aria-hidden="true">{returnToMain ? "←" : "→"}</span>
    </ThemeTransitionLink>
  );
}
