import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { getContactInfo, whatsappHrefFor } from "@/lib/content";

export async function CTABanner() {
  const { whatsappNumber, contactEmail } = await getContactInfo();

  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 text-white">
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl"
        aria-hidden
      />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <span className="h-px w-12 bg-gold-500" aria-hidden />
        <h2 className="max-w-2xl font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Ready for eyes on the ground on your project?
        </h2>
        <p className="max-w-xl text-white/75">
          Tell us about your project and we&apos;ll confirm the right tier and
          visit cadence on a short scoping call.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/contact" variant="gold">
            Get a Quote
          </Button>
          <WhatsAppButton href={whatsappHrefFor(whatsappNumber)} number={whatsappNumber} />
        </div>
        <p className="text-xs text-white/50">{contactEmail}</p>
      </Container>
    </section>
  );
}
