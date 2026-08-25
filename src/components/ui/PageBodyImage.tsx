import type { ReactNode } from "react";

/**
 * Shows a page's body content beside its photo/video — text on one side,
 * full-clarity media on the other, in their own blocks so neither
 * encroaches on the other. Replaces the earlier translucent "watermark"
 * treatment: the media is shown completely clear, at full brightness, not
 * dimmed or overlaid.
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
    <section className="bg-offwhite py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:px-8 md:grid-cols-2 md:items-center md:gap-12">
        <div className="min-w-0">{children}</div>
        <div className="relative min-h-[260px] w-full overflow-hidden rounded-card shadow-card sm:min-h-[340px] md:min-h-[420px]">
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
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
