import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { CTABanner } from "@/components/sections/CTABanner";
import { AbujaMapEmbed } from "@/components/sections/AbujaMapEmbed";
import { Reveal } from "@/components/motion/Reveal";
import { getCoverageAreaContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Coverage Area",
  description:
    "Abuja-based construction oversight with arranged coverage for FCT and interstate projects across Nigeria.",
  alternates: { canonical: "/coverage-area" },
};

export default async function CoverageAreaPage() {
  const coverageArea = await getCoverageAreaContent();

  return (
    <>
      <Breadcrumbs items={[{ label: "Coverage Area" }]} />

      <PageHero eyebrow="Coverage" title="Coverage Area" bgImage={coverageArea.images.headerImage} />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <Reveal delayMs={120} className="order-2 overflow-hidden rounded-card border border-line shadow-card lg:order-1">
            <AbujaMapEmbed />
          </Reveal>

          <Reveal className="order-1 space-y-4 lg:order-2">
            <div className="rounded-card border-l-4 border-gold-500 bg-gold-100/50 p-5">
              <p className="text-lg font-medium text-navy-900">{coverageArea.intro}</p>
            </div>
            <div className="space-y-4 text-slate">
              {coverageArea.points.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <CTABanner />
    </>
  );
}
