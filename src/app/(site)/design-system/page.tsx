import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const metadata: Metadata = {
  title: "Design System (internal)",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "Navy 900 (Primary)", cls: "bg-navy-900", value: "#0B2954" },
  { name: "Navy 800", cls: "bg-navy-800", value: "#123A6E" },
  { name: "Navy 100", cls: "bg-navy-100", value: "#E6EBF2" },
  { name: "Gold 500 (Accent)", cls: "bg-gold-500", value: "#E4A41F" },
  { name: "Gold 600", cls: "bg-gold-600", value: "#B6800F" },
  { name: "Gold 100", cls: "bg-gold-100", value: "#FAECC9" },
  { name: "Ink (text)", cls: "bg-ink", value: "#1A2027" },
  { name: "Slate (secondary text)", cls: "bg-slate", value: "#4B5563" },
];

const tiers = [
  {
    name: "WATCH",
    forWhom: "Self-build clients wanting reassurance",
    includes:
      "Monthly site visit with dated photo/video documentation and a brief written progress report",
  },
  {
    name: "VERIFY",
    forWhom: "Clients making staged contractor payments",
    includes:
      "Everything in Watch, plus Bill of Quantities review and milestone certification to guide payment decisions",
  },
  {
    name: "MANAGE",
    forWhom: "Developers & larger private projects",
    includes:
      "Full project/construction management: contractor engagement support, contract administration, cost control, and quality supervision",
  },
];

/**
 * Internal reference only — not part of the client sitemap.
 * Prepares the approved brand tokens/components for the Phase 3
 * design mockup review. Copy shown here is taken verbatim from the
 * client brief (tagline, tier names/summaries) — nothing invented.
 */
export default function DesignSystemPage() {
  return (
    <main className="flex-1 py-16">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">
          Internal reference, not a site page
        </p>
        <h1 className="mt-2 text-3xl font-bold text-navy-900">
          Anchorline Design System
        </h1>
        <p className="mt-2 max-w-2xl text-slate">
          Brand tokens and base components derived from Section 11 of the
          client brief, for mockup review before full build.
        </p>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-navy-900">Colour</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {swatches.map((s) => (
              <div key={s.name}>
                <div className={`h-16 rounded-card border border-line ${s.cls}`} />
                <p className="mt-2 text-sm font-medium text-ink">{s.name}</p>
                <p className="text-xs text-slate">{s.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-navy-900">Typography</h2>
          <div className="mt-4 space-y-3">
            <p className="text-4xl font-bold text-navy-900">Heading 1 / Inter Bold</p>
            <p className="text-2xl font-bold text-navy-900">Heading 2 / Inter Bold</p>
            <p className="text-lg font-semibold text-navy-900">Heading 3 / Inter Semibold</p>
            <p className="text-base text-ink">
              Body copy / Inter Regular: professional, precise, and
              reassuring. Every page should read like it was written by
              someone who has actually stood on a construction site.
            </p>
            <p className="text-sm text-slate">Small / caption text / Inter Regular</p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-navy-900">Buttons</h2>
          <div className="mt-4 flex flex-wrap gap-4">
            <Button href="#" variant="primary">
              Get a Quote
            </Button>
            <Button href="#" variant="secondary">
              Learn More
            </Button>
            <Button href="#" variant="whatsapp">
              WhatsApp Us
            </Button>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-navy-900">Status key (Sample Report)</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <StatusBadge status="On Track" />
            <StatusBadge status="Minor Delay" />
            <StatusBadge status="Attention Required" />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-navy-900">Service tier cards</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {tiers.map((t) => (
              <Card key={t.name}>
                <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">
                  {t.name}
                </p>
                <p className="mt-2 text-sm font-medium text-navy-900">{t.forWhom}</p>
                <p className="mt-3 text-sm text-slate">{t.includes}</p>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
