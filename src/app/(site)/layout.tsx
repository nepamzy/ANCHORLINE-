import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/layout/BackButton";
import { getContactInfo, getServicesContent, whatsappHrefFor } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { whatsappNumber } = await getContactInfo();
  const { tiers } = await getServicesContent();
  const whatsappHref = whatsappHrefFor(whatsappNumber);

  return (
    <>
      <Header whatsappHref={whatsappHref} whatsappNumber={whatsappNumber} tiers={tiers} />
      <BackButton />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
