import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageBodyImage } from "@/components/ui/PageBodyImage";
import { Section } from "@/components/ui/Section";
import { ClientContentPlaceholder } from "@/components/ui/ClientContentPlaceholder";
import { CTABanner } from "@/components/sections/CTABanner";
import { SampleReportTabs } from "@/components/sections/SampleReportTabs";
import { Reveal } from "@/components/motion/Reveal";
import { getSession } from "@/lib/auth";
import { demoProject } from "@/content/sample-report-demo";

export const metadata: Metadata = {
  title: "Sample Report",
  description:
    "See the structure of an Anchorline site verification report: summary, photo/video documentation, progress assessment, and recommendations.",
};

export default async function SampleReportPage() {
  const session = await getSession();

  return (
    <>
      <PageHeader
        eyebrow="Sample Report"
        title="What you'll receive after every visit"
        description={`This is only a similar version of what you'll get, not your actual report. It uses a fictional project (${demoProject.projectName}) to show the structure and level of detail of a real Anchorline site verification report.`}
        bgImage="/assets/headers/sample-report.jpg"
      />

      <PageBodyImage src="/assets/body/sample-report.jpg" alt="Sample Report">
        {session && (
          <Section variant="transparent">
            <Reveal>
              <ClientContentPlaceholder label="Visible only to you: the real anonymised sample report (PDF/images) is still pending from the client. Public visitors do not see this note, only the illustrative tabs below." />
            </Reveal>
          </Section>
        )}

        <Section variant="transparent">
          <Reveal>
            <SampleReportTabs />
          </Reveal>
        </Section>
      </PageBodyImage>

      <CTABanner />
    </>
  );
}
