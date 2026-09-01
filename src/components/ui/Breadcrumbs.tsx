import Link from "next/link";
import { siteUrl } from "@/lib/site-url";

type Crumb = { label: string; href?: string };

/**
 * Visible trail + BreadcrumbList structured data in one component, so
 * every interior page gets both from a single call. The last crumb is
 * the current page — no href, not a link.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${siteUrl}${item.href === "/" ? "" : item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate">
            {trail.map((item, i) => (
              <li key={item.label} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                {item.href && i < trail.length - 1 ? (
                  <Link href={item.href} className="hover:text-navy-800">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-navy-800">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}
