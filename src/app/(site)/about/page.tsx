import type { Metadata } from "next";
import { PageBodyImage } from "@/components/ui/PageBodyImage";
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
      {/* Full banner image only — no overlaid text panel, per instruction. */}
      <div className="relative overflow-hidden border-b border-line">
        <img
          src="/assets/headers/about.png"
          alt="About Anchorline Project Partners"
          className="h-auto w-full object-cover"
        />
      </div>

      <PageBodyImage videoSrc="/assets/film/about-body.mp4" alt="About Anchorline">
                  <div className="max-w-3xl space-y-4 text-slate">
            <Reveal>
              <p>{aboutContent.narrative}</p>
            </Reveal>
            <Reveal delayMs={80}>
              <p className="text-navy-900 font-medium">
                Why independent oversight matters: when you can&apos;t be on-site
                yourself, you need someone reporting to you, not to your
                contractor or developer.
              </p>
            </Reveal>
            <Reveal delayMs={160}>
              <div>
                <p>Our approach:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {aboutContent.approach.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

                  <Reveal className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">
              Principal Consultant
            </p>
            <h2 className="mt-2 text-2xl font-bold text-navy-900">{business.principal}</h2>
            <ul className="mt-4 space-y-2 text-slate">
              {aboutContent.credentials.map((c) => (
                <li key={c} className="flex gap-2">
                  <span aria-hidden="true" className="text-gold-600">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Reveal>

                  <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">
              Hands-on experience
            </p>
            <h2 className="mt-2 text-2xl font-bold text-navy-900">
              Photos and video from a real site {business.principal.split(" ")[0]} worked on
            </h2>
            <p className="mt-2 max-w-2xl text-slate">
              {business.principal} on site at the {siteVisitPhotos[0].siteName} ({siteVisitPhotos[0].location}),
              one of the projects he worked on in his construction-management career before founding Anchorline.
              This is not an Anchorline client project.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siteVisitPhotos.map((photo, i) => (
              <Reveal key={photo.src} delayMs={i * 40}>
                <figure className="overflow-hidden rounded-card border border-line bg-paper shadow-card">
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
                  <figure className="overflow-hidden rounded-card border border-line bg-paper shadow-card">
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
      </PageBodyImage>

      <CTABanner />
    </>
  );
}
