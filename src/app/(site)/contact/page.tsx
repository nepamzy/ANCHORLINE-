import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
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
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const { whatsappNumber, contactEmail, images } = await getContactInfo();

  return (
    <>
      <Breadcrumbs items={[{ label: "Contact" }]} />

      <PageHero
        eyebrow="Ready to get started?"
        title="Get a Quote"
        description="Tell us about your project. We'll confirm the right tier and visit cadence on a short scoping call."
        bgImage={images.headerImage}
      />

      <Section>
        <div className="overflow-hidden rounded-card border border-line shadow-card lg:grid lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="bg-paper p-6 sm:p-10">
            <ContactForm />
          </Reveal>

          <Reveal delayMs={100} className="relative flex flex-col justify-between bg-navy-950 p-6 text-white sm:p-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images.bodyImage}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover object-top opacity-15"
            />
            <div className="relative">
              <p className="text-lg font-semibold text-white">Prefer WhatsApp?</p>
              <p className="mt-2 text-white/70">
                Message us directly. WhatsApp is an equally weighted way to
                reach us.
              </p>
              <div className="mt-4">
                <WhatsAppButton href={whatsappHrefFor(whatsappNumber)} number={whatsappNumber} />
              </div>
              <p className="mt-2 text-sm text-white/60">{whatsappNumber}</p>
            </div>

            <div className="relative mt-8 border-t border-white/15 pt-6">
              <p className="text-lg font-semibold text-white">Email</p>
              <p className="mt-2">
                <a href={`mailto:${contactEmail}`} className="text-white/80 underline hover:text-white">
                  {contactEmail}
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
