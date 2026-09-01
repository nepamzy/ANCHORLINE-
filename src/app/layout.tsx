import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Bold geometric display face for every heading site-wide — deliberately
// not a serif, a different visual register from the site's earlier
// design pass, used everywhere a heading needs to read as designed
// rather than as body copy set larger.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Independent construction oversight, quantity surveying, and project management for diaspora and private clients building in Nigeria.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Anchorline Project Partners",
    template: "%s | Anchorline Project Partners",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "Anchorline Project Partners",
    title: "Anchorline Project Partners",
    description,
    locale: "en_NG",
    images: [{ url: "/assets/brand/og-image.png", width: 1200, height: 630, alt: "Anchorline Project Partners" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anchorline Project Partners",
    description,
    images: ["/assets/brand/og-image.png"],
  },
};

// Content (including WhatsApp/contact info) is now client-editable via
// the dashboard and takes effect without a rebuild — see
// src/lib/content.ts / src/lib/db.ts. That means the site is rendered
// dynamically (per request) rather than fully statically generated, a
// deliberate tradeoff for the CMS requirement.
export const dynamic = "force-dynamic";

// Root layout is intentionally chrome-free: the public site's
// Header/Footer live in (site)/layout.tsx so the dashboard and login
// pages (siblings of the (site) route group) get their own clean
// shell instead of the customer-facing nav.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
