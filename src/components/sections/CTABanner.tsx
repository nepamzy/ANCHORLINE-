import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { getContactInfo, whatsappHrefFor } from "@/lib/content";

export async function CTABanner() {
  const { whatsappNumber, contactEmail } = await getContactInfo();

  return (
    <section className="bg-navy-900 py-16 text-white">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Ready for eyes on the ground on your project?
        </h2>
        <p className="max-w-xl text-white/80">
          Tell us about your project and we&apos;ll confirm the right tier and
          visit cadence on a short scoping call.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/contact" variant="gold">
            Get a Quote
          </Button>
          <WhatsAppButton href={whatsappHrefFor(whatsappNumber)} number={whatsappNumber} />
        </div>
        <p className="text-xs text-white/60">{contactEmail}</p>
      </Container>
    </section>
  );
}
