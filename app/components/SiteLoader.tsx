"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { loadSiteImage } from "../lib/site-assets";
import SpaceScene from "./SpaceScene";

const assetCount = 5;

function createRendererPreparation() {
  let resolve!: () => void;
  const ready = new Promise<void>((done) => { resolve = done; });
  return { ready, resolve };
}

export default function SiteLoader({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [rendererPreparation, setRendererPreparation] = useState(createRendererPreparation);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [completed, setCompleted] = useState(0);
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
      rendererPreparation.ready,
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
  }, [router, rendererPreparation]);

  useEffect(() => {
    if (ready) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [ready]);

  return (
    <>
      <div className="site-shell" data-ready={ready} data-space-active={pathname === "/alternate"} inert={!ready} aria-hidden={!ready} aria-busy={!ready}>
        {children}
      </div>
      <SpaceScene active={ready && pathname === "/alternate"} onPrepared={rendererPreparation.resolve} />
      <div className="site-loader" data-ready={ready} aria-hidden={ready}>
        <div className="site-loader-content">
          <p className="site-loader-name">cole sladowsky</p>
          <progress className="site-loader-progress" max={assetCount} value={completed} aria-label="Loading site assets" />
          <p className="site-loader-status" role="status">{status === "error" ? "couldn’t finish loading" : "loading"}</p>
          {status === "error" && (
            <div className="site-loader-actions">
              <button type="button" onClick={() => {
                cancelLoading.current?.();
                setCompleted(0);
                setStatus("loading");
                setRendererPreparation(createRendererPreparation());
              }}>try again</button>
              <button type="button" onClick={() => { cancelLoading.current?.(); setStatus("ready"); }}>enter site</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
