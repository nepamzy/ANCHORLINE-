import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ClientContentPlaceholder } from "@/components/ui/ClientContentPlaceholder";
import { CTABanner } from "@/components/sections/CTABanner";
import { Reveal } from "@/components/motion/Reveal";
import { getTestimonialsContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Client testimonials for Anchorline Project Partners.",
};

export default async function TestimonialsPage() {
  const { items } = await getTestimonialsContent();

  return (
    <>
      <PageHeader
        eyebrow="Testimonials"
        title="What clients say"
        description="We're collecting feedback as we complete engagements. Testimonials will appear here as clients approve them."
        bgImage="/assets/headers/testimonials.jpg"
      />

      <Section variant="offwhite">
        {items.length === 0 ? (
          <Reveal>
            <ClientContentPlaceholder label="No approved client testimonials yet. This section will be populated as feedback is collected and approved. Nothing fabricated in the meantime." />
          </Reveal>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((t, i) => (
              <Reveal key={t.name} delayMs={i * 80}>
                <Card>
                  <p className="text-slate">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-4 text-sm font-semibold text-navy-900">
                    {t.name}
                    {t.role ? <span className="font-normal text-slate">, {t.role}</span> : null}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <CTABanner />
    </>
  );
}
