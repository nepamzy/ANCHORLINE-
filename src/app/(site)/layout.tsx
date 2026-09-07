import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/layout/BackButton";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { getServicesContent } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { tiers } = await getServicesContent();

  return (
    <>
      <Header tiers={tiers} />
      <BackButton />
      <main className="flex-1 pb-20">{children}</main>
      <Footer />
      <FloatingActions />
    </>
  );
}
