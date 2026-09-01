/**
 * Small gold square used at the start of a list row — replaces plain
 * "•" bullet dashes everywhere a list appears on the site.
 */
export function Marker({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`mt-2 h-1.5 w-1.5 shrink-0 bg-gold-500 ${className}`} />;
}
