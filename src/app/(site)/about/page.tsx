import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Marker } from "@/components/ui/Marker";
import { CTABanner } from "@/components/sections/CTABanner";
import { Reveal } from "@/components/motion/Reveal";
import { business } from "@/content/site";
import { getAboutContent } from "@/lib/content";
import { siteVisitPhotos, siteVisitVideos } from "@/content/site-visits";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the Principal Consultant behind Anchorline Project Partners' independent construction supervision for diaspora clients.",
};

export default async function AboutPage() {
  const aboutContent = await getAboutContent();

  return (
    <>
      <PageHero eyebrow="About" title={business.name} description={business.tagline} bgImage={aboutContent.images.headerImage} />

      <Section>
        <Reveal className="max-w-3xl space-y-4 text-slate">
          <p className="text-lg">{aboutContent.narrative}</p>
          <p className="font-medium text-navy-900">
            Why independent oversight matters: when you can&apos;t be on-site
            yourself, you need someone reporting to you, not to your
            contractor or developer.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-2 sm:grid-cols-2">
          {aboutContent.approach.map((a) => (
            <div key={a} className="flex gap-3 border-t border-line py-4">
              <Marker />
              <span className="text-slate">{a}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={aboutContent.images.bodyImage} alt="" className="h-72 w-full object-cover sm:h-96" />

      <Section variant="offwhite">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">{business.principal}</p>
            <p className="mt-1 text-sm text-slate">Founder &amp; lead consultant</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {aboutContent.credentials.map((c) => (
              <div key={c} className="flex gap-3 border-t border-line py-4">
                <Marker />
                <span className="text-sm text-slate">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Hands-on experience"
            title={`Photos and video from a real site ${business.principal.split(" ")[0]} worked on`}
            description={`${business.principal} on site at the ${siteVisitPhotos[0].siteName} (${siteVisitPhotos[0].location}), one of the projects he worked on in his construction-management career before founding Anchorline. This is not an Anchorline client project.`}
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteVisitPhotos.map((photo, i) => (
            <Reveal key={photo.src} delayMs={i * 40}>
              <figure className="overflow-hidden rounded-card border border-line bg-white shadow-card">
                <img src={photo.src} alt={photo.alt} className="h-48 w-full object-cover" loading="lazy" />
                <figcaption className="p-3">
                  <p className="text-sm font-semibold text-navy-900">{photo.caption}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Video</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {siteVisitVideos.map((video, i) => (
              <Reveal key={video.src} delayMs={i * 60}>
                <figure className="overflow-hidden rounded-card border border-line bg-white shadow-card">
                  <video
                    src={video.src}
                    poster={video.poster}
                    controls
                    muted
                    preload="metadata"
                    playsInline
                    className="aspect-video w-full bg-navy-950 object-cover"
                  >
                    Your browser does not support embedded video.
                  </video>
                  <figcaption className="p-3">
                    <p className="text-sm font-semibold text-navy-900">{video.caption}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <CTABanner />
    </>
  );
}
