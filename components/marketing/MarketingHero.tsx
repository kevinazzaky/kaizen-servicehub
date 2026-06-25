import Link from "next/link";
import { companyProfile, portalStats } from "@/lib/marketing-data";
import { MonitoringPreview } from "./MonitoringPreview";

export function MarketingHero() {
  const whatsappUrl = `https://wa.me/${companyProfile.whatsappNumber}?text=${encodeURIComponent(
    companyProfile.whatsappMessage,
  )}`;

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(245,180,59,0.14),transparent_26%),radial-gradient(circle_at_82%_10%,rgba(74,93,128,0.28),transparent_32%),linear-gradient(135deg,#0b0f17_0%,#111827_54%,#202a3a_100%)] px-6 pb-16 pt-14 text-white sm:pb-20 lg:pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="animate-fade-up mb-5 inline-flex rounded-full border border-[#f5b43b]/20 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f5b43b] shadow-sm">
            {companyProfile.tagline}
          </p>
          <h1 className="animate-fade-up max-w-3xl text-4xl font-bold tracking-tight text-white [animation-delay:120ms] sm:text-5xl lg:text-6xl">
            ServiceFlow untuk maintenance yang lebih transparan.
          </h1>
          <p className="animate-fade-up mt-5 max-w-2xl text-base leading-8 text-slate-300 [animation-delay:220ms] sm:text-lg">
            Satu alur untuk request client, work order, pekerjaan teknisi, dan
            report dengan bukti foto.
          </p>

          <div className="animate-fade-up mt-7 flex flex-col gap-3 [animation-delay:320ms] sm:flex-row">
            <Link
              href="/login?role=CLIENT"
              className="inline-flex items-center justify-center rounded-md bg-[#f5b43b] px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-[#ffc65a]"
            >
              Buka Portal
            </Link>
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Konsultasi
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {portalStats.map((item, index) => (
              <div
                key={item.label}
                className="animate-fade-up rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
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

        <MonitoringPreview />
      </div>
    </section>
  );
}
