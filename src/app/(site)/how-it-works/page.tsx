import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageBodyImage } from "@/components/ui/PageBodyImage";
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
      <PageHeader
        eyebrow="Process"
        title="How it works"
        description="Five steps from first enquiry to ongoing reporting."
        bgImage="/assets/headers/how-it-works.jpg"
      />

      <PageBodyImage src="/assets/body/how-it-works.jpg" alt="How It Works">
        <Section variant="offwhite">
          <div className="max-w-2xl mx-auto">
            <HowItWorksScroller steps={howItWorksSteps} />
          </div>
        </Section>
      </PageBodyImage>

      <CTABanner />
    </>
  );
}
