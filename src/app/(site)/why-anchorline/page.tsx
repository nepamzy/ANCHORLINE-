import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { CTABanner } from "@/components/sections/CTABanner";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Why Anchorline",
  description:
    "The problem Anchorline Project Partners exists to solve: giving diaspora clients and staged-payment clients real control over a project they can't personally stand in front of.",
  alternates: { canonical: "/why-anchorline" },
};

export default function WhyAnchorlinePage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Why Anchorline" }]} />

      <PageHero
        eyebrow="Why Anchorline"
        title="You shouldn't have to feel powerless about your own money"
        description="The problem we exist to solve, and who we built Anchorline to serve."
        bgImage="/assets/client-photos/pexels-sonu-kumar-1211352235-33862076.jpg"
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">The Problem</p>
            <p className="mt-3 font-display text-2xl font-medium text-navy-900 leading-snug sm:text-3xl">
              If you&apos;re building or investing in property from abroad, there&apos;s usually no reliable
              way to know what&apos;s actually happening with your money and your project. The
              people you&apos;d naturally ask to check for you, family, friends, informal contacts,
              usually don&apos;t have the technical training to catch what actually matters.
            </p>
            <blockquote className="mt-6 border-l-2 border-gold-500 pl-4 text-lg italic text-slate">
              &ldquo;How do I know what&apos;s actually happening on my project when I can&apos;t be
              there myself?&rdquo;
            </blockquote>
            <p className="mt-6 text-slate">
              That question sits behind almost every decision our clients make: which contractor to
              trust, when to release the next payment, whether the person telling them
              &ldquo;it&apos;s going fine&rdquo; actually has a reason to say so either way. Distance
              doesn&apos;t just make a project harder to manage. It removes your ability to verify
              anything for yourself. Photos can be old. Updates can be vague on purpose or by
              accident. And the one person you&apos;re relying on to flag a problem may be the same
              person who caused it.
            </p>
          </Reveal>

          <Reveal delayMs={100} className="rounded-card bg-navy-950 p-8 text-white">
            <p className="font-display text-xl font-medium text-white">Anchorline exists to close that gap</p>
            <p className="mt-3 text-white/75">
              An independent, technically trained set of eyes on your site, reporting to you and
              only you, so the next decision you make is based on what&apos;s actually true, not on
              what you&apos;ve been told.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section variant="offwhite">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Who It&apos;s For</p>
          <h2 className="mt-2 font-display text-2xl font-medium text-navy-900 sm:text-3xl">
            Three kinds of clients, one underlying need
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <Reveal delayMs={0}>
            <Card className="h-full">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Primary</p>
              <p className="mt-2 font-semibold text-navy-900">Diaspora Nigerians</p>
              <p className="mt-2 text-sm text-slate">
                Building or buying property remotely, often for the first time, usually with
                savings that took years to put together and no way to physically check on it
                themselves.
              </p>
            </Card>
          </Reveal>
          <Reveal delayMs={90}>
            <Card className="h-full">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Secondary</p>
              <p className="mt-2 font-semibold text-navy-900">Local private clients</p>
              <p className="mt-2 text-sm text-slate">
                Staging payments to a contractor and wanting independent confirmation before
                releasing the next installment. Present in the country, but still not on-site
                every day.
              </p>
            </Card>
          </Reveal>
          <Reveal delayMs={180}>
            <Card className="h-full">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Tertiary / Future</p>
              <p className="mt-2 font-semibold text-navy-900">Developers &amp; larger projects</p>
              <p className="mt-2 text-sm text-slate">
                Multi-contractor developments that need coordinated, ongoing quality supervision
                at a scale beyond a single self-build, covered under the Manage tier.
              </p>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section>
        <Reveal className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">What This Means For You</p>
          <h2 className="mt-2 font-display text-2xl font-medium text-navy-900 sm:text-3xl">
            This isn&apos;t about hiring a construction expert. It&apos;s about getting your control back.
          </h2>
          <p className="mt-4 text-slate">
            It&apos;s worth being direct about this: our clients don&apos;t come to us because they woke up
            wanting a technical audit. They come to us because they&apos;re tired of feeling
            powerless about money they worked hard for, sent across an ocean, and can&apos;t
            personally watch over. The credentials, the report structure, the site visits. All
            of that exists in service of one outcome: you knowing, not guessing, what&apos;s happening
            with your project.
          </p>
          <p className="mt-4 text-slate">
            If that&apos;s the feeling you recognise, the not-knowing, the hoping the update you got
            last week was actually true, that&apos;s exactly the problem Anchorline was built to
            remove.
          </p>
        </Reveal>
      </Section>

      <CTABanner />
    </>
  );
}
