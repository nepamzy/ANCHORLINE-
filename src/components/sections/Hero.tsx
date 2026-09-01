"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SiteLineDiagram } from "./SiteLineDiagram";
import { HeroStats } from "./HeroStats";
import { RotatingWord } from "./RotatingWord";
import { business, contactNav, trustPillars, heroRotatingLines } from "@/content/site";

/**
 * Homepage opening: the single video on the whole site, shown as a pure
 * full-screen visual with no text overlaid on it — the sales copy
 * (headline, tagline, description, CTAs, trust pillars) lives in its own
 * section directly below, on the normal page background, not floating on
 * top of the footage.
 */
export function Hero({ heroDescription, videoSrc }: { heroDescription: string; videoSrc: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [nameLead, nameAccent] = splitCompanyName(business.name);

  function toggleMute() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  }

  return (
    <>
      <section className="relative h-[85svh] min-h-[440px] w-full overflow-hidden bg-ink">
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          >
            Your browser does not support embedded video.
          </video>
        )}

        {/* Left-side gradient scrim, only behind the rotating text — the rest of the video stays clear. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[min(95vw,760px)] bg-linear-to-r from-ink/80 via-ink/35 to-transparent" aria-hidden />

        <div className="absolute top-1/2 left-[6vw] max-w-xl -translate-y-1/2">
          <RotatingWord
            words={heroRotatingLines}
            className="block font-display text-[clamp(1.75rem,4.5vw,3.25rem)] leading-[1.05] font-bold text-paper"
          />
        </div>

        {videoSrc && (
          <>
            <p className="absolute right-4 bottom-4 max-w-[50vw] text-right font-mono text-[9px] tracking-[0.15em] text-paper/50 sm:right-6 sm:max-w-xs">
              Real site footage, not an Anchorline client project.
            </p>

            <button
              type="button"
              onClick={toggleMute}
              aria-pressed={!muted}
              aria-label={muted ? "Unmute video" : "Mute video"}
              className="absolute top-6 right-[6vw] flex items-center gap-2 rounded-full border border-paper/30 bg-ink/50 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-paper/90 backdrop-blur transition hover:border-paper/60 hover:bg-ink/80"
            >
              {muted ? (
                <>
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    <path d="M2 2l20 20-1.41 1.41L16 18.83A8.99 8.99 0 0 1 14 20.77v-2.06a7 7 0 0 0 1.17-.44l-1.6-1.6A4.47 4.47 0 0 1 12 17.4v-2.83l-2-2H3v-4h1.17L.59 3.41 2 2z" />
                  </svg>
                  Unmute
                </>
              ) : (
                <>
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                  Mute
                </>
              )}
            </button>
          </>
        )}
      </section>

      <section className="bg-navy-950">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-[6vw] pt-12 pb-16 sm:pt-16 sm:pb-20 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] text-gold-400">
              {business.location.toUpperCase()} &middot; INDEPENDENT CONSTRUCTION OVERSIGHT
            </p>

            <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.25rem)] leading-[0.98] font-bold tracking-tight text-paper">
              {nameLead} <span className="text-gold-400">{nameAccent}</span>
            </h1>

            <p className="mt-4 max-w-xl text-xl font-medium text-paper/90">{business.tagline}</p>

            <p className="mt-4 max-w-xl text-paper/75">{heroDescription}</p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button href={contactNav.href} variant="gold">
                Get a Quote
              </Button>
              <a
                href="/how-it-works"
                className="text-sm font-semibold text-paper underline decoration-gold-400 decoration-2 underline-offset-4 hover:text-gold-200"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {trustPillars.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-paper/10 px-3 py-1.5 text-xs font-semibold text-paper backdrop-blur-sm"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-10 border-t border-white/10 pt-10 lg:items-start lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
            <SiteLineDiagram />
            <HeroStats />
          </div>
        </div>
      </section>
    </>
  );
}

/** Splits the company name on its last space so the closing word can carry the gold accent. */
function splitCompanyName(name: string): [string, string] {
  const idx = name.lastIndexOf(" ");
  if (idx === -1) return [name, ""];
  return [name.slice(0, idx), name.slice(idx + 1)];
}
