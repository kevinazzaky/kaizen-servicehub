import { MarketingContactSection } from "@/components/marketing/MarketingContactSection";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { PortalBenefitsSection } from "@/components/marketing/PortalBenefitsSection";
import { ServicesPreviewSection } from "@/components/marketing/ServicesPreviewSection";
import { WorkflowSection } from "@/components/marketing/WorkflowSection";
import {
  getMarketingCopy,
  type MarketingLang,
} from "@/lib/marketing-data";

type HomeProps = {
  searchParams: Promise<{
    lang?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const query = await searchParams;
  const lang: MarketingLang = query.lang === "id" ? "id" : "en";
  const copy = getMarketingCopy(lang);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <MarketingNavbar copy={copy} />
      <MarketingHero copy={copy} lang={lang} />
      <PortalBenefitsSection copy={copy} />
      <WorkflowSection copy={copy} />
      <ServicesPreviewSection copy={copy} />
      <MarketingContactSection copy={copy} lang={lang} />
      <MarketingFooter copy={copy} />
    </main>
  );
}
