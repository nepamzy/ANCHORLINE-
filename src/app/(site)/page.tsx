import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WhyAnchorlineList } from "@/components/sections/WhyAnchorlineList";
import { HowItWorksScroller } from "@/components/sections/HowItWorksScroller";
import { TierCard } from "@/components/sections/TierCard";
import { Reveal } from "@/components/motion/Reveal";
import { business } from "@/content/site";
import { getHomeContent, getHowItWorksContent, getServicesContent, getContactInfo } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Independent Construction Oversight for Diaspora Clients in Nigeria",
  description:
    "Independent site verification, quantity surveying, and project management for clients building or investing in property in Nigeria, from wherever they are.",
};

export default async function Home() {
  const { heroDescription, positioning, images: homeImages } = await getHomeContent();
  const { tiers } = await getServicesContent();
  const { steps } = await getHowItWorksContent();
  const { contactEmail } = await getContactInfo();

  // Structured data uses only facts stated in the client brief — no
  // address, ratings, or hours are included because the brief doesn't
  // supply them, and none of that is invented here.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: business.name,
    description:
      "Independent construction oversight, quantity surveying, and project management for diaspora and private clients building in Nigeria.",
    url: siteUrl,
    email: contactEmail,
    areaServed: ["Abuja", "Federal Capital Territory", "Nigeria"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero heroDescription={heroDescription} videoSrc={homeImages.heroVideo} />

      <TrustStrip />

      {/* Service tier snapshot */}
      <Section variant="paper">
        <Reveal>
          <SectionHeading
            eyebrow="Service tiers"
            title="A tier for however involved you want us to be"
            description="Watch, Verify, and Manage: fees are tailored to project scope, location, and visit frequency. Tap a tier for the full details."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delayMs={i * 80}>
              <Link href={`/services/${t.name.toLowerCase()}`} className="block h-full">
                <TierCard tier={t} />
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Why Anchorline — vertical editorial list, not a carousel */}
      <Section variant="navy">
        <SectionHeading eyebrow="Why Anchorline" title="What makes us different" invert />
        <div className="mt-8">
          <WhyAnchorlineList items={positioning} />
        </div>
      </Section>

      {/* How it works teaser — text-only, scroll-lit steps, no photo */}
      <Section variant="offwhite">
        <Reveal>
          <SectionHeading
            eyebrow="Process"
            title="How it works"
            description="From first enquiry to ongoing reporting, in five clear steps."
          />
        </Reveal>
        <div className="mx-auto mt-10 max-w-2xl">
          <HowItWorksScroller steps={steps} limit={4} />
        </div>
        <div className="mt-8 text-center">
          <Link href="/how-it-works" className="text-sm font-semibold text-navy-800 hover:text-navy-900">
            See the full process →
          </Link>
        </div>
      </Section>

      <CTABanner />
    </>
  );
}
