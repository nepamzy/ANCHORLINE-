import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { CTABanner } from "@/components/sections/CTABanner";
import { HowItWorksScroller } from "@/components/sections/HowItWorksScroller";
import { getHowItWorksContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "From first enquiry to ongoing site reporting: the five-step client journey for Anchorline Project Partners.",
};

export default async function HowItWorksPage() {
  const { steps: howItWorksSteps } = await getHowItWorksContent();

  return (
    <>
      <PageHero
        eyebrow="Process"
        title="How it works"
        description="Five steps from first enquiry to ongoing reporting."
        bgImage="/assets/client-photos/pexels-lwhphoto-18153132.jpg"
      />

      <Section>
        <div className="mx-auto max-w-2xl">
          <HowItWorksScroller steps={howItWorksSteps} />
        </div>
      </Section>

      <CTABanner />
    </>
  );
}
