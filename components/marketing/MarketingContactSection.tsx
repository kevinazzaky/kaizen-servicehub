import Link from "next/link";
import { companyProfile } from "@/lib/marketing-data";

export function MarketingContactSection() {
  const whatsappUrl = `https://wa.me/${companyProfile.whatsappNumber}?text=${encodeURIComponent(
    companyProfile.whatsappMessage,
  )}`;

  return (
    <section id="contact" className="bg-[#f8fafc] px-6 py-16 text-slate-950">
      <div className="mx-auto max-w-7xl rounded-2xl bg-[linear-gradient(135deg,#0b0f17,#111827_62%,#202a3a)] px-6 py-10 text-white shadow-xl shadow-slate-200 md:flex md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f5b43b]">
            Mulai ServiceFlow
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Siap membuat maintenance lebih mudah dipantau?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Hubungi tim untuk diskusi kebutuhan kerja sama dan demo alur
            ServiceFlow.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-0">
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-[#f5b43b] px-5 py-2.5 text-center text-sm font-bold text-slate-950 transition hover:bg-[#ffc65a]"
          >
            WhatsApp
          </Link>
          <Link
            href="/login?role=ADMIN"
            className="rounded-md border border-white/15 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Admin
          </Link>
        </div>
      </div>
    </section>
  );
}
