import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageBodyImage } from "@/components/ui/PageBodyImage";
import { Section } from "@/components/ui/Section";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Reveal } from "@/components/motion/Reveal";
import { getContactInfo, whatsappHrefFor } from "@/lib/content";
import { ContactForm } from "./ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact / Get a Quote",
  description:
    "Tell us about your project and request a quote from Anchorline Project Partners, or reach us directly on WhatsApp.",
};

export default async function ContactPage() {
  const { whatsappNumber, contactEmail } = await getContactInfo();

  return (
    <>
      <PageHeader
        eyebrow="Ready to get started?"
        title="Get a Quote"
        description="Tell us about your project. We'll confirm the right tier and visit cadence on a short scoping call."
        bgImage="/assets/headers/contact.jpg"
      />

      <PageBodyImage src="/assets/body/contact.png" alt="Get a Quote">
        <Section variant="transparent">
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <ContactForm />
            </Reveal>

            <Reveal delayMs={100} className="rounded-card border border-line bg-offwhite p-6">
              <p className="text-lg font-semibold text-navy-900">Prefer WhatsApp?</p>
              <p className="mt-2 text-slate">
                Message us directly. WhatsApp is an equally weighted way to
                reach us.
              </p>
              <div className="mt-4">
                <WhatsAppButton href={whatsappHrefFor(whatsappNumber)} number={whatsappNumber} />
              </div>
              <p className="mt-2 text-sm text-slate">{whatsappNumber}</p>

              <p className="mt-6 text-lg font-semibold text-navy-900">Email</p>
              <p className="mt-2 text-slate">
                <a href={`mailto:${contactEmail}`} className="underline">
                  {contactEmail}
                </a>
              </p>
            </Reveal>
          </div>
        </Section>
      </PageBodyImage>
    </>
  );
}
