import type { ReactNode } from "react";

/**
 * Wraps a page's body content with a full-cover watermark photo OR video
 * behind it. The media fills the entire section (length and width, matched
 * to however tall the content inside makes it) — not a separate block, not
 * letterboxed. The overlay is light enough to see the media clearly, but
 * strong enough that the text in front of it stays easy to read without
 * straining.
 */
export function PageBodyImage({
  src,
  videoSrc,
  alt = "",
  children,
}: {
  src?: string;
  videoSrc?: string;
  alt?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden">
      {videoSrc ? (
        <video
          aria-hidden
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <img
          src={src}
          alt={alt}
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-paper/45" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
