"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { loadSiteImage } from "../lib/site-assets";

const SiteReady = createContext(false);
const assetCount = 5;

export function useSiteReady() {
  return useContext(SiteReady);
}

export default function SiteLoader({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [completed, setCompleted] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const cancelLoading = useRef<(() => void) | null>(null);
  const ready = status === "ready";

  useEffect(() => {
    let active = true;
    let count = 0;
    router.prefetch("/alternate");
    const family = getComputedStyle(document.body).getPropertyValue("--font-alternate").split(",")[0].trim();
    const tasks = [
      loadSiteImage("/logo.png"),
      loadSiteImage("/space/io-8k.webp"),
      loadSiteImage("/space/jupiter-4k.webp"),
      import("./SpaceScene"),
      Promise.all([600, 700].map((weight) => document.fonts.load(`${weight} 16px ${family}`))),
    ];
    const timeout = setTimeout(() => { if (active) setStatus("error"); }, 30000);

    void Promise.all(tasks.map((task) => task.then(() => {
      if (active) setCompleted(++count);
    }))).then(() => {
      if (active) setStatus("ready");
    }).catch(() => {
      if (active) setStatus("error");
    }).finally(() => clearTimeout(timeout));

    const cancel = () => { active = false; clearTimeout(timeout); };
    cancelLoading.current = cancel;
    return () => {
      cancel();
      if (cancelLoading.current === cancel) cancelLoading.current = null;
    };
  }, [attempt, router]);

  useEffect(() => {
    if (ready) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [ready]);

  return (
    <SiteReady.Provider value={ready}>
      <div className="site-shell" data-ready={ready} inert={!ready} aria-hidden={!ready} aria-busy={!ready}>
        {children}
      </div>
      <div className="site-loader" data-ready={ready} aria-hidden={ready}>
        <div className="site-loader-content">
          <p className="site-loader-name">cole sladowsky</p>
          <progress className="site-loader-progress" max={assetCount} value={completed} aria-label="Loading site assets" />
          <p className="site-loader-status" role="status">{status === "error" ? "couldn’t finish loading" : "loading"}</p>
          {status === "error" && (
            <div className="site-loader-actions">
              <button type="button" onClick={() => { setCompleted(0); setStatus("loading"); setAttempt((value) => value + 1); }}>try again</button>
              <button type="button" onClick={() => { cancelLoading.current?.(); setStatus("ready"); }}>enter site</button>
            </div>
          )}
        </div>
      </div>
    </SiteReady.Provider>
  );
}
