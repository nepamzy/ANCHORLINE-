import { Button } from "@/components/ui/Button";
import { contactNav } from "@/content/site";
import { getContactInfo, whatsappHrefFor } from "@/lib/content";

/**
 * Small pill CTAs docked to the bottom edge of the viewport on every
 * public page, replacing the header's WhatsApp/Get a Quote buttons per
 * instruction — "hanging on the base" rather than sitting in big boxes
 * up top. The WhatsApp CTA reads "Book a Consultation" but still opens
 * the WhatsApp inbox.
 */
export async function FloatingActions() {
  const { whatsappNumber } = await getContactInfo();

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center gap-2 px-4">
      <Button
        href={whatsappHrefFor(whatsappNumber)}
        variant="whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Book a consultation on WhatsApp: ${whatsappNumber}`}
        className="rounded-full px-4 py-2.5 text-xs shadow-lg"
      >
        Book a Consultation
      </Button>
      <Button
        href={contactNav.href}
        variant="gold"
        className="rounded-full px-4 py-2.5 text-xs shadow-lg"
      >
        Get a Quote
      </Button>
    </div>
  );
}
