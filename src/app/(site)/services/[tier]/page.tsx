import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageBodyImage } from "@/components/ui/PageBodyImage";
import { Button } from "@/components/ui/Button";
import { TierIcon } from "@/components/sections/TierIcon";
import { CTABanner } from "@/components/sections/CTABanner";
import { Reveal } from "@/components/motion/Reveal";
import { getServicesContent } from "@/lib/content";
import { tierDetails } from "@/content/tier-details";

export function generateStaticParams() {
  return tierDetails.map((t) => ({ tier: t.name.toLowerCase() }));
}

async function findTier(slug: string) {
  const { tiers } = await getServicesContent();
  const tier = tiers.find((t) => t.name.toLowerCase() === slug.toLowerCase());
  const detail = tierDetails.find((d) => d.name.toLowerCase() === slug.toLowerCase());
  return tier && detail ? { tier, detail } : null;
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
  const { tier, detail } = found;

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={`${tier.name}: Full Details`}
        description={detail.summary}
        bgImage="/assets/headers/services.png"
      />

      <PageBodyImage src="/assets/body/tier-detail.png" alt={`${tier.name} details`}>
          <Link href="/services" className="text-sm font-semibold text-navy-800 hover:text-navy-900">
            ← Back to all tiers
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-[auto_1fr]">
            <Reveal>
              <TierIcon name={tier.name} className="h-16 w-16 text-gold-600" />
            </Reveal>

            <Reveal delayMs={80} className="max-w-3xl space-y-8">
              <div>
                <p className="text-xl font-semibold text-navy-900">For</p>
                <p className="mt-1 text-slate">{tier.forWhom}</p>
              </div>

              <div>
                <p className="text-xl font-semibold text-navy-900">Best for</p>
                <ul className="mt-2 space-y-2 text-slate">
                  {detail.bestFor.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span aria-hidden className="text-gold-600">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xl font-semibold text-navy-900">Everything included</p>
                <ul className="mt-2 space-y-2 text-slate">
                  {detail.whatsIncluded.map((w) => (
                    <li key={w} className="flex gap-2">
                      <span aria-hidden className="text-gold-600">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-control bg-navy-50 p-4">
                  <p className="text-xs font-semibold tracking-wide text-navy-900 uppercase">Visit cadence</p>
                  <p className="mt-1 text-slate">{detail.cadence}</p>
                </div>
                <div className="rounded-control bg-navy-50 p-4">
                  <p className="text-xs font-semibold tracking-wide text-navy-900 uppercase">You receive</p>
                  <p className="mt-1 text-slate">{detail.deliverable}</p>
                </div>
              </div>

              <Button href="/contact">Get a Quote for {tier.name}</Button>
            </Reveal>
          </div>
      </PageBodyImage>

      <CTABanner />
    </>
  );
}
