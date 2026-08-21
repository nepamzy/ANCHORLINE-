export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-navy-900">{title}</h2>
      {description && <p className="mt-3 text-slate">{description}</p>}
    </div>
  );
}
