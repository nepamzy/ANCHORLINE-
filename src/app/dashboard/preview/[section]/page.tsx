import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";
import {
  getHomeDraft,
  getAboutDraft,
  getServicesDraft,
  getHowItWorksDraft,
  getFAQDraft,
  getTestimonialsDraft,
  getCoverageAreaDraft,
} from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { TierCard } from "@/components/sections/TierCard";
import { HowItWorksSteps } from "@/components/sections/HowItWorksSteps";
import { business } from "@/content/site";

function PreviewBanner({ section }: { section: string }) {
  return (
    <div className="sticky top-0 z-50 bg-gold-500 px-6 py-2 text-center text-sm font-semibold text-navy-950">
      PREVIEW: draft content for &ldquo;{section}&rdquo;, not yet published
    </div>
  );
}

export default async function PreviewPage({ params }: { params: Promise<{ section: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { section } = await params;
  await ensureSeeded();

  switch (section) {
    case "home": {
      const home = await getHomeDraft();
      return (
        <>
          <PreviewBanner section={section} />
          <Section>
            <p className="mx-auto max-w-2xl text-center text-lg text-slate">{home.heroDescription}</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {home.positioning.map((p) => (
                <Card key={p.title}>
                  <p className="font-semibold text-navy-900">{p.title}</p>
                  <p className="mt-1 text-sm text-slate">{p.body}</p>
                </Card>
              ))}
            </div>
          </Section>
        </>
      );
    }

    case "about": {
      const about = await getAboutDraft();
      return (
        <>
          <PreviewBanner section={section} />
          <Section>
            <div className="max-w-3xl space-y-4 text-slate">
              <p>{about.narrative}</p>
              <div>
                <p>Our approach:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {about.approach.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Principal Consultant</p>
                <h2 className="mt-2 text-2xl font-bold text-navy-900">{business.principal}</h2>
                <ul className="mt-4 space-y-2 text-slate">
                  {about.credentials.map((c) => (
                    <li key={c}>• {c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        </>
      );
    }

    case "services": {
      const { tiers } = await getServicesDraft();
      return (
        <>
          <PreviewBanner section={section} />
          <Section>
            <div className="grid gap-6 sm:grid-cols-3">
              {tiers.map((t) => (
                <TierCard key={t.name} tier={t} showDetail />
              ))}
            </div>
          </Section>
        </>
      );
    }

    case "how-it-works": {
      const { steps } = await getHowItWorksDraft();
      return (
        <>
          <PreviewBanner section={section} />
          <Section>
            <HowItWorksSteps steps={steps} />
          </Section>
        </>
      );
    }

    case "faq": {
      const { items } = await getFAQDraft();
      return (
        <>
          <PreviewBanner section={section} />
          <Section>
            <div className="max-w-3xl divide-y divide-line">
              {items.map((item) => (
                <div key={item.question} className="py-5">
                  <p className="font-semibold text-navy-900">{item.question}</p>
                  <p className="mt-2 text-slate">{item.answer}</p>
                </div>
              ))}
            </div>
          </Section>
        </>
      );
    }

    case "testimonials": {
      const { items } = await getTestimonialsDraft();
      return (
        <>
          <PreviewBanner section={section} />
          <Section>
            {items.length === 0 ? (
              <p className="text-slate">No testimonials in this draft yet.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {items.map((t) => (
                  <Card key={t.name}>
                    <p className="text-slate">&ldquo;{t.quote}&rdquo;</p>
                    <p className="mt-4 text-sm font-semibold text-navy-900">
                      {t.name}
                      {t.role ? <span className="font-normal text-slate">, {t.role}</span> : null}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </Section>
        </>
      );
    }

    case "coverage-area": {
      const coverage = await getCoverageAreaDraft();
      return (
        <>
          <PreviewBanner section={section} />
          <Section>
            <div className="max-w-xl space-y-4 text-slate">
              <p className="text-lg text-navy-900 font-medium">{coverage.intro}</p>
              {coverage.points.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Section>
        </>
      );
    }

    default:
      notFound();
  }
}
