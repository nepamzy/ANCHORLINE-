import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Marker } from "@/components/ui/Marker";
import { TierIcon } from "@/components/sections/TierIcon";
import { CTABanner } from "@/components/sections/CTABanner";
import { Reveal } from "@/components/motion/Reveal";
import { getServicesContent } from "@/lib/content";
import { tierDetails } from "@/content/tier-details";

export function generateStaticParams() {
  return tierDetails.map((t) => ({ tier: t.name.toLowerCase() }));
}

async function findTier(slug: string) {
  const { tiers, images } = await getServicesContent();
  const tier = tiers.find((t) => t.name.toLowerCase() === slug.toLowerCase());
  const detail = tierDetails.find((d) => d.name.toLowerCase() === slug.toLowerCase());
  return tier && detail ? { tier, detail, images } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tier: string }>;
}): Promise<Metadata> {
  const { tier: slug } = await params;
  const found = await findTier(slug);
  if (!found) return { title: "Service Tier" };
  return {
    title: `${found.tier.name}: Full Details`,
    description: found.detail.summary,
  };
}

export default async function TierDetailPage({ params }: { params: Promise<{ tier: string }> }) {
  const { tier: slug } = await params;
  const found = await findTier(slug);
  if (!found) notFound();
  const { tier, detail, images } = found;

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={`${tier.name}: Full Details`}
        description={detail.summary}
        bgImage={images.headerImage}
      />

      <Section>
        <Link href="/services" className="text-sm font-semibold text-navy-800 hover:text-navy-900">
          ← Back to all tiers
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <Reveal>
            <Card className="overflow-hidden p-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images.bodyImage} alt={`${tier.name} details`} className="h-52 w-full object-cover" />
              <div className="p-6">
                <TierIcon name={tier.name} className="h-10 w-10 text-gold-600" />
                <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-gold-600">For</p>
                <p className="text-slate">{tier.forWhom}</p>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-control bg-navy-50 p-4">
                    <p className="text-xs font-semibold tracking-wide text-navy-900 uppercase">Visit cadence</p>
                    <p className="mt-1 text-sm text-slate">{detail.cadence}</p>
                  </div>
                  <div className="rounded-control bg-navy-50 p-4">
                    <p className="text-xs font-semibold tracking-wide text-navy-900 uppercase">You receive</p>
                    <p className="mt-1 text-sm text-slate">{detail.deliverable}</p>
                  </div>
                </div>

                <Button href="/contact" className="mt-6 w-full">
                  Get a Quote for {tier.name}
                </Button>
              </div>
            </Card>
          </Reveal>

          <Reveal delayMs={80} className="space-y-8">
            <div>
              <p className="font-display text-xl font-medium text-navy-900">Best for</p>
              <ul className="mt-2 space-y-2 text-slate">
                {detail.bestFor.map((b) => (
                  <li key={b} className="flex gap-3">
                    <Marker />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-display text-xl font-medium text-navy-900">Everything included</p>
              <ul className="mt-2 space-y-2 text-slate">
                {detail.whatsIncluded.map((w) => (
                  <li key={w} className="flex gap-3">
                    <Marker />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <CTABanner />
    </>
  );
}
