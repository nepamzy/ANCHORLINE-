/**
 * Visually distinct marker for content the client has not yet supplied.
 * Never styled to look like finished copy — see AGENTS/CLAUDE project
 * rules: "never allow placeholder content to accidentally appear as
 * final client content."
 */
export function ClientContentPlaceholder({ label }: { label: string }) {
  return (
    <div className="rounded-card border-2 border-dashed border-gold-500 bg-gold-100/40 p-6 text-sm text-navy-900">
      <p className="font-semibold uppercase tracking-wide text-xs text-gold-600">
        Client content required
      </p>
      <p className="mt-1">{label}</p>
    </div>
  );
}
