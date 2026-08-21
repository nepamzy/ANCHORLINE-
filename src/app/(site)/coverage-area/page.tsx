import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { CTABanner } from "@/components/sections/CTABanner";
import { AbujaMapEmbed } from "@/components/sections/AbujaMapEmbed";
import { Reveal } from "@/components/motion/Reveal";
import { getCoverageAreaContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Coverage Area",
  description:
    "Abuja-based construction oversight with arranged coverage for FCT and interstate projects across Nigeria.",
};

export default async function CoverageAreaPage() {
  const coverageArea = await getCoverageAreaContent();

  return (
    <>
      <PageHeader eyebrow="Coverage" title="Coverage Area" bgImage="/assets/headers/coverage-area.jpg" />

      <Section variant="offwhite">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <Reveal className="max-w-xl space-y-4 text-slate">
            <p className="text-lg text-navy-900 font-medium">{coverageArea.intro}</p>
            {coverageArea.points.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
          <Reveal delayMs={120}>
            <AbujaMapEmbed />
          </Reveal>
        </div>
      </Section>

      <CTABanner />
    </>
  );
}
