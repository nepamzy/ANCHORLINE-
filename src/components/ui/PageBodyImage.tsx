import type { ReactNode } from "react";

/**
 * Wraps a page's body content with a full-cover watermark photo behind it.
 * The image fills the entire section (length and width, matched to however
 * tall the content inside makes it) — not a separate block, not letterboxed.
 * The overlay is light enough to see the photo clearly, but strong enough
 * that the text in front of it stays easy to read without straining.
 */
export function PageBodyImage({
  src,
  alt = "",
  children,
}: {
  src: string;
  alt?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden">
      <img
        src={src}
        alt={alt}
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-paper/45" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
