"use client";

import { useEffect, useRef, useState } from "react";
import ContentGap from "../components/ContentGap";

type Mode = "shop" | "verbouwen";

type Panel = {
  mode: Mode;
  href: string;
  eyebrow: string;
  title: string;
  sub: string;
  cta: string;
  meta: string;
  /** poster image (shown as-is under prefers-reduced-motion) */
  poster?: string;
  /** optional video; only played when motion is allowed */
  video?: string;
  /** registered content-gap id — when set, the panel media shows the
   * shared placeholder photo (no real poster/video is delivered yet). */
  gapId?: string;
};

const PANELS: Panel[] = [
  {
    mode: "shop",
    href: "/shop",
    eyebrow: "Webshop",
    title: "Shop je interieur",
    sub: "Badkamers, sanitair en raamdecoratie op maat",
    cta: "Naar de webshop →",
    meta: "300+ merken",
    // No shop/badkamer poster or video exists in the repo yet.
    // cat-badkamer-1.mp4 is registered in content-gaps.json.
    gapId: "home-split-video-shop",
  },
  {
    mode: "verbouwen",
    href: "/verbouwen",
    eyebrow: "Verbouwen",
    title: "Laat het ons doen",
    sub: "Complete verbouwingen met eigen vakmensen",
    cta: "Plan een gratis intake →",
    meta: "Vaste prijs · eigen team",
    // A real work video (cat-verbouwen-1.mp4) is still needed — registered
    // in content-gaps.json — so the shared placeholder photo stands in.
    gapId: "home-split-video-verbouwen",
  },
];

const LABEL: Record<Mode, string> = { shop: "Webshop", verbouwen: "Verbouwen" };

export default function SplitEntry() {
  const [lastMode, setLastMode] = useState<Mode | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      const stored = window.localStorage.getItem("wk_last_mode");
      if (stored === "shop" || stored === "verbouwen") setLastMode(stored);
    } catch {
      /* localStorage unavailable — ignore */
    }
  }, []);

  const remember = (mode: Mode) => {
    try {
      window.localStorage.setItem("wk_last_mode", mode);
    } catch {
      /* ignore */
    }
  };

  const resumeHref = lastMode === "shop" ? "/shop" : "/verbouwen";

  return (
    <>
      {lastMode && (
        <div className="wk-resume">
          <a
            className="wk-resume__link"
            href={resumeHref}
            onClick={() => remember(lastMode)}
          >
            <span aria-hidden="true">↩</span>
            Verder waar je gebleven was → {LABEL[lastMode]}
          </a>
        </div>
      )}

      <div className="wk-split">
        {PANELS.map((p) => (
          <a
            key={p.mode}
            className={`wk-panel wk-panel--${p.mode}${p.gapId ? " wk-panel--gap" : ""}`}
            href={p.href}
            onClick={() => remember(p.mode)}
            aria-label={`${p.title} — ${p.sub}`}
          >
            {p.gapId ? (
              <ContentGap id={p.gapId} variant="fill" />
            ) : (
              <div className="wk-panel__media" aria-hidden="true">
                {p.video && !reduced.current ? (
                  <video
                    poster={p.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                  >
                    <source src={p.video} type="video/mp4" />
                  </video>
                ) : p.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.poster} alt="" />
                ) : null}
              </div>
            )}

            <p className="wk-panel__eyebrow">{p.eyebrow}</p>
            <h2 className="wk-panel__title">{p.title}</h2>
            <p className="wk-panel__sub">{p.sub}</p>
            <span className="wk-panel__cta">{p.cta}</span>
            <p className="wk-panel__meta">{p.meta}</p>
          </a>
        ))}
      </div>
    </>
  );
}
