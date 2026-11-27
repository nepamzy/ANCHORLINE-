export function ComingSoon({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">{eyebrow}</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">{title}</h1>

      <div className="mt-8 flex flex-col items-center rounded-card border border-dashed border-line bg-paper p-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-50 text-navy-800">
          {icon}
        </span>
        <p className="mt-4 font-semibold text-navy-900">Coming soon</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate">{description}</p>
        <p className="mt-4 text-xs text-slate">
          In the meantime, use{" "}
          <a href="/portal/requests" className="font-semibold text-navy-800 underline hover:text-navy-900">
            Requests
          </a>{" "}
          to reach us.
        </p>
      </div>
    </div>
  );
}
