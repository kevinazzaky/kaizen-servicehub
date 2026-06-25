import { MarketingContactSection } from "@/components/marketing/MarketingContactSection";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { PortalBenefitsSection } from "@/components/marketing/PortalBenefitsSection";
import { ServicesPreviewSection } from "@/components/marketing/ServicesPreviewSection";
import { WorkflowSection } from "@/components/marketing/WorkflowSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <MarketingNavbar />
      <MarketingHero />
      <PortalBenefitsSection />
      <WorkflowSection />
      <ServicesPreviewSection />
      <MarketingContactSection />
      <MarketingFooter />
    </main>
  );
}
