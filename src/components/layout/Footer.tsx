import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { business, contactNav } from "@/content/site";
import { getContactInfo, whatsappHrefFor } from "@/lib/content";

const exploreLinks = [
  { label: "About", href: "/about" },
  { label: "Why Anchorline", href: "/why-anchorline" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/how-it-works" },
];

const resourceLinks = [
  { label: "Sample Report", href: "/sample-report" },
  { label: "Coverage Area", href: "/coverage-area" },
  { label: "FAQ", href: "/faq" },
];

export async function Footer() {
  const { whatsappNumber, contactEmail } = await getContactInfo();

  return (
    <footer className="border-t border-line bg-navy-950 text-white">
      <Container className="py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-500 font-mono text-sm text-gold-400">
                ⚓
              </span>
              <span className="font-display text-lg font-medium text-white">{business.name}</span>
            </div>
            <p className="mt-3 max-w-[34ch] text-sm text-white/65">{business.tagline}</p>
            <p className="mt-3 text-xs text-white/45">
              {business.location} &middot; Principal: {business.principal}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide text-white/80 uppercase">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/70 hover:text-gold-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide text-white/80 uppercase">Resources</p>
            <ul className="mt-4 space-y-2.5">
              {resourceLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/70 hover:text-gold-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide text-white/80 uppercase">Get in touch</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={whatsappHrefFor(whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-gold-400"
                >
                  WhatsApp: {whatsappNumber}
                </a>
              </li>
              <li>
                <a href={`mailto:${contactEmail}`} className="text-sm text-white/70 hover:text-gold-400">
                  {contactEmail}
                </a>
              </li>
              <li>
                <Link href={contactNav.href} className="text-sm text-white/70 hover:text-gold-400">
                  {contactNav.label}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {business.name}. All rights reserved.
          </p>
          <p className="text-xs text-white/50">Site Verification &middot; Quantity Surveying &middot; Project Management, Nigeria-wide</p>
        </div>
      </Container>
    </footer>
  );
}
