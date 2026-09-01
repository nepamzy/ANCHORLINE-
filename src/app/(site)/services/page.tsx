import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { CTABanner } from "@/components/sections/CTABanner";
import { TierCard } from "@/components/sections/TierCard";
import { Reveal } from "@/components/motion/Reveal";
import { getServicesContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services: Watch, Verify, Manage",
  description:
    "Three tiers of independent construction oversight and quantity surveying: Watch, Verify, and Manage. Fees tailored to project scope, location, and visit frequency.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const { tiers, images } = await getServicesContent();

  return (
    <>
      <Breadcrumbs items={[{ label: "Services" }]} />

      <PageHero
        eyebrow="Services"
        title="Watch. Verify. Manage."
        description="Fees are tailored to project scope, location, and visit frequency. Tap a tier to see the full details."
        bgImage={images.headerImage}
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-3">
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delayMs={i * 90}>
              <Link href={`/services/${tier.name.toLowerCase()}`} className="block h-full">
                <TierCard tier={tier} />
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABanner />
    </>
  );
}
