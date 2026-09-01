import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ClientContentPlaceholder } from "@/components/ui/ClientContentPlaceholder";
import { CTABanner } from "@/components/sections/CTABanner";
import { SampleReportTabs } from "@/components/sections/SampleReportTabs";
import { Reveal } from "@/components/motion/Reveal";
import { getSession } from "@/lib/auth";
import { getSampleReportAsset } from "@/lib/content";
import { demoProject } from "@/content/sample-report-demo";

export const metadata: Metadata = {
  title: "Sample Report",
  description:
    "See the structure of an Anchorline site verification report: summary, photo/video documentation, progress assessment, and recommendations.",
};

export default async function SampleReportPage() {
  const session = await getSession();
  const { images } = await getSampleReportAsset();

  return (
    <>
      <PageHero
        eyebrow="Sample Report"
        title="What you'll receive after every visit"
        description={`This is only a similar version of what you'll get, not your actual report. It uses a fictional project (${demoProject.projectName}) to show the structure and level of detail of a real Anchorline site verification report.`}
        bgImage={images.headerImage}
      />

      <Section>
        {session && (
          <Reveal>
            <ClientContentPlaceholder label="Visible only to you: the real anonymised sample report (PDF/images) is still pending from the client. Public visitors do not see this note, only the illustrative tabs below." />
          </Reveal>
        )}

        <Reveal delayMs={session ? 80 : 0}>
          <Card className="mt-6 p-6 sm:p-8">
            <SampleReportTabs />
          </Card>
        </Reveal>
      </Section>

      <CTABanner />
    </>
  );
}
