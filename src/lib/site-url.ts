/**
 * Production domain has not been decided yet (Phase 2 architecture
 * doc — hosting/domain provider is an open decision). Falls back to
 * localhost so sitemap/robots/canonical/OG URLs are still well-formed
 * in development. Set NEXT_PUBLIC_SITE_URL once a domain is chosen.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
