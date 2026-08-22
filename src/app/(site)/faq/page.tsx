import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageBodyImage } from "@/components/ui/PageBodyImage";
import { Section } from "@/components/ui/Section";
import { CTABanner } from "@/components/sections/CTABanner";
import { Reveal } from "@/components/motion/Reveal";
import { getFAQContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about working with Anchorline Project Partners from abroad.",
};

export default async function FAQPage() {
  const { items: faqItems } = await getFAQContent();

  return (
    <>
      <PageHeader eyebrow="FAQ" title="Frequently asked questions" bgImage="/assets/headers/faq.jpg" />

      <PageBodyImage src="/assets/body/faq.jpg" alt="FAQ">
        <Section variant="transparent">
          <Reveal className="max-w-3xl divide-y divide-line">
            {faqItems.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-navy-900 marker:content-none">
                  {item.question}
                  <span aria-hidden="true" className="shrink-0 text-gold-600 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-slate">{item.answer}</p>
              </details>
            ))}
          </Reveal>
        </Section>
      </PageBodyImage>

      <CTABanner />
    </>
  );
}
