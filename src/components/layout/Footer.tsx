import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { business, contactNav, navigation } from "@/content/site";
import { getContactInfo, whatsappHrefFor } from "@/lib/content";

export async function Footer() {
  const { whatsappNumber, contactEmail } = await getContactInfo();

  return (
    <footer className="border-t border-line bg-navy-950 text-white">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="text-lg font-bold">{business.name}</p>
            <p className="mt-2 text-sm text-white/70">{business.tagline}</p>
            <p className="mt-4 text-sm text-white/70">{business.location}</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Site</p>
            <ul className="mt-3 space-y-2">
              {[...navigation, contactNav].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/70 hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Contact</p>
            <p className="mt-3 text-sm text-white/70">
              <a href={`mailto:${contactEmail}`} className="hover:text-white">
                {contactEmail}
              </a>
            </p>
            <p className="mt-1 text-sm text-white/70">{whatsappNumber}</p>
            <div className="mt-4">
              <WhatsAppButton href={whatsappHrefFor(whatsappNumber)} number={whatsappNumber} />
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
          © {new Date().getFullYear()} {business.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
