import { Button } from "./Button";

export function WhatsAppButton({
  href,
  number,
  className = "",
}: {
  href: string;
  number: string;
  className?: string;
}) {
  return (
    <Button
      href={href}
      variant="whatsapp"
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with Anchorline Project Partners on WhatsApp: ${number}`}
    >
      WhatsApp Us
    </Button>
  );
}
