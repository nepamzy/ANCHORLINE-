export function SectionHeading({
  eyebrow,
  title,
  description,
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Use on dark section backgrounds (e.g. Section variant="navy") — swaps title/description to light text. */
  invert?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className={`text-sm font-semibold uppercase tracking-wide ${invert ? "text-gold-400" : "text-gold-600"}`}>
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl ${
          invert ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-3 ${invert ? "text-white/70" : "text-slate"}`}>{description}</p>
      )}
    </div>
  );
}
