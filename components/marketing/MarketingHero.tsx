import Link from "next/link";
import {
  getWhatsappUrl,
  type MarketingCopy,
  type MarketingLang,
} from "@/lib/marketing-data";
import { MonitoringPreview } from "./MonitoringPreview";

export function MarketingHero({
  copy,
  lang,
}: {
  copy: MarketingCopy;
  lang: MarketingLang;
}) {
  const whatsappUrl = getWhatsappUrl(lang);

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(245,180,59,0.14),transparent_26%),radial-gradient(circle_at_82%_10%,rgba(74,93,128,0.28),transparent_32%),linear-gradient(135deg,#0b0f17_0%,#111827_54%,#202a3a_100%)] px-4 pb-14 pt-10 text-white sm:px-6 sm:pb-20 sm:pt-14 lg:pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] lg:gap-10">
        <div>
          <p className="animate-fade-up mb-5 inline-flex max-w-full rounded-full border border-[#f5b43b]/20 bg-black/20 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#f5b43b] shadow-sm sm:px-4 sm:text-xs sm:tracking-[0.18em]">
            {copy.tagline}
          </p>
          <h1 className="animate-fade-up max-w-3xl text-3xl font-bold tracking-tight text-white [animation-delay:120ms] sm:text-5xl lg:text-6xl">
            {copy.hero.title}
          </h1>
          <p className="animate-fade-up mt-5 max-w-2xl text-sm leading-7 text-slate-300 [animation-delay:220ms] sm:text-lg sm:leading-8">
            {copy.hero.description}
          </p>

          <div className="animate-fade-up mt-7 flex flex-col gap-3 [animation-delay:320ms] sm:flex-row">
            <Link
              href="/login?role=CLIENT"
              className="inline-flex items-center justify-center rounded-full bg-[#f5b43b] px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-[#ffc65a]"
            >
              {copy.hero.primaryCta}
            </Link>
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {copy.hero.secondaryCta}
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
            {copy.stats.map((item, index) => (
              <div
                key={item.label}
                className="animate-fade-up rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
                style={{ animationDelay: `${420 + index * 90}ms` }}
              >
                <p className="text-lg font-bold text-white">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <MonitoringPreview items={copy.preview} />
      </div>
    </section>
  );
}
