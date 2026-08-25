import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageBodyImage } from "@/components/ui/PageBodyImage";
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
        bgImage="/assets/headers/services.png"
      />

      <PageBodyImage videoSrc="/assets/film/services-body.mp4" alt="Services">
        <div className="grid gap-6">
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delayMs={i * 90}>
              <ServiceTierCard tier={tier} index={i} />
            </Reveal>
          ))}
        </div>
      </PageBodyImage>

      <CTABanner />
    </>
  );
}
