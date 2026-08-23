import { Container } from "./Container";

export function PageHeader({
  eyebrow,
  title,
  description,
  bgImage,
  bgPosition = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional realistic photo shown as a watermark background behind the heading. */
  bgImage?: string;
  /** object-position for bgImage — override to "top" for photos where the subject sits high in frame (e.g. a portrait). */
  bgPosition?: "center" | "top" | "bottom";
}) {
  return (
    <div className="relative overflow-hidden border-b border-line bg-navy-50 py-16 sm:py-20">
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: bgPosition }}
        />
      )}
      <Container className="relative">
        <div
          className={
            bgImage
              ? "inline-block max-w-[78%] rounded-2xl bg-paper/90 px-4 py-4 shadow-lg backdrop-blur-sm sm:max-w-2xl sm:px-8 sm:py-6"
              : ""
          }
        >
          {eyebrow && (
            <p
              className="text-sm font-semibold uppercase tracking-wide text-gold-600 animate-fade-up motion-reduce:animate-none"
              style={{ animationDelay: "0ms" }}
            >
              {eyebrow}
            </p>
          )}
          <h1
            className="mt-2 text-3xl sm:text-4xl font-bold text-navy-900 animate-fade-up motion-reduce:animate-none"
            style={{ animationDelay: "80ms" }}
          >
            {title}
          </h1>
          {description && (
            <p
              className="mt-3 max-w-2xl text-slate animate-fade-up motion-reduce:animate-none"
              style={{ animationDelay: "160ms" }}
            >
              {description}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
