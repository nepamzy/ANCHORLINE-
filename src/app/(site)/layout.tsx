import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteWatermark } from "@/components/layout/SiteWatermark";
import { BackButton } from "@/components/layout/BackButton";
import { getContactInfo, whatsappHrefFor } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { whatsappNumber } = await getContactInfo();
  const whatsappHref = whatsappHrefFor(whatsappNumber);

  return (
    <>
      <Header whatsappHref={whatsappHref} whatsappNumber={whatsappNumber} />
      <BackButton />
      <main className="flex-1">{children}</main>
      <Footer />
      <SiteWatermark />
    </>
  );
}
