import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getContactInfo, getServicesContent, whatsappHrefFor } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page Not Found",
};

// Top-level not-found boundary: catches any URL that doesn't match a
// route. (site)/layout.tsx doesn't wrap this, so Header/Footer are
// rendered directly here to keep the same chrome on a 404 as everywhere
// else on the site.
export default async function NotFound() {
  const { whatsappNumber } = await getContactInfo();
  const { tiers } = await getServicesContent();
  const whatsappHref = whatsappHrefFor(whatsappNumber);

  return (
    <>
      <Header whatsappHref={whatsappHref} whatsappNumber={whatsappNumber} tiers={tiers} />
      <main className="flex-1">
        <Container className="flex min-h-[50vh] flex-col items-start justify-center py-24 sm:py-32">
          <p className="font-mono text-xs tracking-[0.3em] text-gold-600 uppercase">404</p>
          <h1 className="mt-4 max-w-xl font-display text-4xl font-medium tracking-tight text-navy-950 sm:text-5xl">
            We couldn&apos;t find that page
          </h1>
          <p className="mt-4 max-w-lg text-slate">
            The page you&apos;re looking for may have moved or no longer exists. Here are a few places to
            start instead.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/" variant="primary">
              Back to homepage
            </Button>
            <Button href="/services" variant="secondary">
              View services
            </Button>
            <Button href="/contact" variant="secondary">
              Contact us
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
