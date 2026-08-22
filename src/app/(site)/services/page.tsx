import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageBodyImage } from "@/components/ui/PageBodyImage";
import { Section } from "@/components/ui/Section";
import { CTABanner } from "@/components/sections/CTABanner";
import { ServiceTierCard } from "@/components/sections/ServiceTierExpandable";
import { Reveal } from "@/components/motion/Reveal";
import { getServicesContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services: Watch, Verify, Manage",
  description:
    "Three tiers of independent construction oversight and quantity surveying: Watch, Verify, and Manage. Fees tailored to project scope, location, and visit frequency.",
};

export default async function ServicesPage() {
  const { tiers } = await getServicesContent();

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Watch. Verify. Manage."
        description="Fees are tailored to project scope, location, and visit frequency. Tap a tier to see the full details."
        bgImage="/assets/headers/services.jpg"
      />

      <PageBodyImage src="/assets/body/services.jpg" alt="Services">
        <Section variant="gold">
          <div className="grid gap-8 lg:grid-cols-3">
            {tiers.map((tier, i) => (
              <Reveal key={tier.name} delayMs={i * 90}>
                <ServiceTierCard tier={tier} index={i} />
              </Reveal>
            ))}
          </div>
        </Section>
      </PageBodyImage>

      <CTABanner />
    </>
  );
}
