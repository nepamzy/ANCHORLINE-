import { Container } from "./Container";

/**
 * Full-bleed interior-page hero: photo fills the band, a dark gradient
 * scrim keeps the headline readable over any image, no floating text
 * card. Replaces PageHeader's "photo behind a small pinned card" pattern
 * on every page that wants a bigger, more editorial opening statement.
 * PageBodyImage remains the right tool for a genuine two-column split
 * further down the page — this is only the opening band.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  bgImage,
  bgPosition = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  bgImage?: string;
  bgPosition?: "center" | "top" | "bottom";
}) {
  return (
    <div className="relative overflow-hidden bg-navy-950 py-24 sm:py-32">
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: bgPosition }}
        />
      )}
      <div
        className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-950/70 to-navy-950/20"
        aria-hidden
      />
      <Container className="relative">
        {eyebrow && (
          <p
            className="font-mono text-xs tracking-[0.3em] text-gold-400 uppercase animate-fade-up motion-reduce:animate-none"
            style={{ animationDelay: "0ms" }}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className="mt-4 max-w-2xl font-display text-4xl font-medium tracking-tight text-paper sm:text-5xl animate-fade-up motion-reduce:animate-none"
          style={{ animationDelay: "80ms" }}
        >
          {title}
        </h1>
        {description && (
          <p
            className="mt-4 max-w-xl text-paper/80 animate-fade-up motion-reduce:animate-none"
            style={{ animationDelay: "160ms" }}
          >
            {description}
          </p>
        )}
      </Container>
    </div>
  );
}
