"use client";

import { useRef, useState } from "react";

/**
 * Real video for the home page hero — replaces the earlier ScrollBuildFilm,
 * which simulated motion from 156 stock photos of an unrelated property
 * rather than showing a real video (see git history / handoff). This is
 * genuine footage from a site the Principal Consultant worked on before
 * founding Anchorline (same site as the About page's "hands-on experience"
 * section — see src/content/site-visits.ts for the full disclosure).
 *
 * Autoplays muted (required by browser autoplay policy — a video can't
 * autoplay with sound), looping, with a visible mute/unmute control so
 * the visitor can turn sound on if they want it.
 */
export function HomeFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  function toggleMute() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  }

  return (
    <section
      className="relative h-[70vh] w-full overflow-hidden bg-ink sm:h-[85vh]"
      aria-label="Real site footage: reinforcement, concrete pour, and structural progress"
    >
      <video
        ref={videoRef}
        src="/assets/site-videos/site-wide-pan.mp4"
        poster="/assets/site-videos/site-wide-pan-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      >
        Your browser does not support embedded video.
      </video>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-ink/70 to-transparent" />

      <p className="absolute bottom-5 left-4 max-w-[70vw] font-mono text-[9px] tracking-[0.2em] text-paper/60 sm:bottom-6 sm:left-6 sm:max-w-sm">
        Real site footage — a project the Principal Consultant worked on before founding Anchorline, not an Anchorline client project.
      </p>

      <button
        type="button"
        onClick={toggleMute}
        aria-pressed={!muted}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="absolute right-4 bottom-5 flex items-center gap-2 rounded-full border border-paper/30 bg-ink/60 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-paper/90 backdrop-blur transition hover:border-paper/60 hover:bg-ink/80 sm:right-6 sm:bottom-6"
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
    </section>
  );
}
